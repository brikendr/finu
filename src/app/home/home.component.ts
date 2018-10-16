import { Component, OnInit } from "@angular/core";

import { Page } from "tns-core-modules/ui/page";

import { registerElement } from "nativescript-angular/element-registry";
import { CardView } from "nativescript-cardview";

import * as app from "application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
registerElement("CardView", () => CardView);

@Component({
  selector: "Home",
  moduleId: module.id,
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  balanceProgressBar: string;
  budgetProgressBar: string;

  /* Collection Retrivable Data */
  totalExpenses: number;
  income: number;
  _pendingBills: number;
  savingsGoal: number;
  _dailyBudget: number;
  _maintainedSavings: number;
  menuIcon = String.fromCharCode(parseInt("f061", 16));

  /* Progress bar values */
  expensesOnBalance: string;
  expensesOnBudget: string;

  constructor(
    private page: Page
  ) {
    this.page.backgroundSpanUnderStatusBar = true;
    this.page.className = "homepage-container";
  }

  ngOnInit(): void {
    /* Initialize properties */
    this.totalExpenses = 16500;
    this.income = 25400;
    this.savingsGoal = 10000;
    this._pendingBills = 3;

    const d = this.totalExpenses + this.savingsGoal;
    this._maintainedSavings = d > this.income ? this.savingsGoal - (d - this.income) : this.savingsGoal;

    this.calculateMonthlyBalance();
    this.calculateMonthlyBudget();
    this.calculateDailyBudget();
  }

  calculateMonthlyBalance() {
    let percent = 0;
    let progress = (this.totalExpenses / this.income) * 100;
    progress = progress > 100 ? 100 : progress;
    let incExpense = 0;
    const intervalId = setInterval(() => {
      this.animateBalanceProgressBar(percent);
      percent++;
      incExpense += (this.totalExpenses / progress);
      this.expensesOnBalance = `${Math.round(incExpense)} NOK`;

      if (percent > progress) {
        this.expensesOnBalance = `${Math.round(this.totalExpenses)} NOK`;
        clearInterval(intervalId);
      }
    }, 50);
  }

  animateBalanceProgressBar(percent) {
    this.balanceProgressBar = percent + "*," + (100 - percent) + "*";
  }

  calculateMonthlyBudget() {
    let percent = 0;
    const budget = this.income - this.savingsGoal;
    let progress = (this.totalExpenses / budget) * 100;
    progress = progress > 100 ? 100 : progress;
    let incExpense = 0;
    const intervalId = setInterval(() => {
      this.animateBudgetProgressBar(percent);
      percent++;
      incExpense += (this.totalExpenses / progress);
      this.expensesOnBudget = `${Math.round(incExpense)} NOK`;

      if (percent > progress) {
        this.expensesOnBudget = `${Math.round(this.totalExpenses)} NOK`;
        clearInterval(intervalId);
      }
    }, 30);
  }

  animateBudgetProgressBar(percent) {
    this.budgetProgressBar = percent + "*," + (100 - percent) + "*";
  }

  calculateDailyBudget() {
    const now = new Date();
    const daysInCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const today = now.getDate();
    const budgetTotal = Math.round(this.income - this.savingsGoal - this.totalExpenses);
    const daysLeft = daysInCurrentMonth - today;
    this._dailyBudget = Math.round(budgetTotal / daysLeft);
  }

  get monthlyBalance(): string {
    return  `Balance: ${this.income - this.totalExpenses} NOK`;
  }

  get monthlyBudget(): string {
    const budgetTotal = Math.round(this.income - this.savingsGoal - this.totalExpenses);

    return `Budget: ${budgetTotal} NOK`;
  }

  get pendingBills(): string {
    return `${this._pendingBills} Pending Bills`;
  }

  get maintainedSavings(): string {
    return `${this._maintainedSavings} / ${this.savingsGoal} NOK`;
  }

  get dailyBudget(): string {
    return this._dailyBudget > 0 ? `${this._dailyBudget} NOK` : "0 NOK";
  }

  get currentDayMonth(): string {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const now = new Date();

    return `${now.getDate()} ${monthNames[now.getMonth()]}`;
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }
}
