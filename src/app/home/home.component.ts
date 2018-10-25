import { Component, OnInit } from "@angular/core";
import { registerElement } from "nativescript-angular/element-registry";
import { CardView } from "nativescript-cardview";

import * as app from "application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";

import { RouterExtensions } from "nativescript-angular/router";
import { BudgetPlan } from "../budgetplan/shared/budgetplan.model";
import { BudgetPlanService } from "../budgetplan/shared/budgetplan.service";

import { Kinvey } from "kinvey-nativescript-sdk";
import { ExpenseService } from "../expense/shared/expense.service";
import { UtilService } from "../shared/utils.service";
registerElement("CardView", () => CardView);

@Component({
  selector: "Home",
  moduleId: module.id,
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  _isProcessing: boolean = false;
  expenseProgressBar: string;
  budgetProgressBar: string;
  plannedExpenseArrow: string;
  budgetStatus: object = {
    description: "N/A",
    status: "unavailable"
  };

  /* Collection Retrivable Data */
  _totalExpenses: number;
  _income: number;
  _earned: number;
  _pendingBills: number;
  _savingsGoal: number;
  _dailyBudget: number;
  _maintainedSavings: number;
  _overBudget: number;

  menuIcon = String.fromCharCode(parseInt("f0c9", 16));

  /* Progress bar values */
  expensesOnBalance: string;
  expensesOnBudget: string;

  constructor(
    private _routerExtensions: RouterExtensions,
    private _budgetPlanService: BudgetPlanService,
    private _expenseService: ExpenseService
  ) {
  }

  ngOnInit(): void {
    if (Kinvey.User.getActiveUser() === null) {
      this.navigate("login", true);
    }

    this._isProcessing = true;
    const userId = Kinvey.User.getActiveUser()._id;
    this._budgetPlanService.getUserBudgetPlan(userId)
      .then((plan: BudgetPlan) => {
        this._income = plan.netIncome;
        this._savingsGoal = plan.savingsGoal;
        this._pendingBills = 3; // combo of bills and billrecord

        this._expenseService.getUserExpenses(userId)
          .then((transactions: any) => {
            this._isProcessing = false;
            const sumExpenses = transactions.expenses.reduce((expenseSum, expense) => {
              return expenseSum + expense.amount;
            }, 0);
            const sumDeposit = transactions.deposits.reduce((depositSum, expense) => {
              return depositSum + expense.amount;
            }, 0);
            this._totalExpenses = sumExpenses;
            this._earned = this._income + sumDeposit;
            const d = this._totalExpenses + this._savingsGoal;
            this._maintainedSavings = d > this._income ? this._savingsGoal - (d - this._income) : this._savingsGoal;

            this.calculateExpensesOnBalance();
            this.calculateExpensesOnBudget();
            this.calculateDailyBudget();
            this.calculatePlannedExpenses();
          });
      })
      .catch((error) => {
        console.log("Error initializing home components!", error);
        this._isProcessing = false;
      });
  }

  calculateExpensesOnBalance() {
    let percent = 0;
    let progress = (this._totalExpenses / this._income) * 100;
    progress = progress > 100 ? 100 : progress;
    let incExpense = 0;
    const intervalId = setInterval(() => {
      this.animateExpenseProgressBar(percent);
      percent++;
      incExpense += progress > 0 ? (this._totalExpenses / progress) : 0;
      this.expensesOnBalance = `${Math.round(incExpense)} NOK`;
      if (percent > progress) {
        this.expensesOnBalance = `${Math.round(this._totalExpenses)} NOK`;
        clearInterval(intervalId);
      }
    }, 50);
  }

  animateExpenseProgressBar(percent) {
    this.expenseProgressBar = percent + "*," + (100 - percent) + "*";
  }

  calculateExpensesOnBudget() {
    let percent = 0;
    const budget = this._income - this._savingsGoal;
    let progress = (this._totalExpenses / budget) * 100;
    progress = progress > 100 ? 100 : progress;
    let incExpense = 0;
    const intervalId = setInterval(() => {
      this.animateBudgetProgressBar(percent);
      percent++;
      incExpense += (this._totalExpenses / progress);
      this.expensesOnBudget = `${Math.round(incExpense)} NOK`;

      if (percent > progress) {
        this.expensesOnBudget = `${Math.round(this._totalExpenses)} NOK`;
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
    const budgetTotal = Math.round(this._income - this._savingsGoal - this._totalExpenses);
    const daysLeft = daysInCurrentMonth - today;
    this._dailyBudget = Math.round(budgetTotal / daysLeft);
    this.budgetStatus = UtilService.generateStatusLabel(this._dailyBudget);
  }

  calculatePlannedExpenses() {
    const now = new Date();
    const currentDay = now.getDate();
    const daysInCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const budgetTotal = Math.round(this._earned - this._savingsGoal);

    const plannedDailyBudget = budgetTotal / daysInCurrentMonth;
    const plannedExpenses = currentDay * plannedDailyBudget;
    this._overBudget = plannedExpenses - this._totalExpenses;

    // Animation
    let percent = 0;
    let progress = (plannedExpenses / budgetTotal) * 100;
    progress = progress > 100 ? 100 : progress;
    const intervalId = setInterval(() => {
      this.animatePlannedExpeseArrow(percent);
      percent++;

      if (percent > progress) {
        clearInterval(intervalId);
      }
    }, 30);
  }

  animatePlannedExpeseArrow(percent) {
    this.plannedExpenseArrow = percent + "*," + (100 - percent) + "*";
  }

  get monthlyBalance(): string {
    return  `${this._income - this._totalExpenses} NOK`;
  }

  get totalEarned(): string {
    return `${this._earned} NOK`;
  }

  get monthlyBudget(): string {
    const budgetTotal = Math.round(this._earned - this._savingsGoal - this._totalExpenses);

    return `Budget: ${budgetTotal} NOK`;
  }

  get pendingBills(): string {
    return `${this._pendingBills} Pending Bills`;
  }

  get maintainedSavings(): string {
    return `${this._maintainedSavings} NOK`;
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

  get overbudgetStatus(): object {
    return this._overBudget > 0 ?
      {
        text: `Overbudget! +${this._overBudget}`, color: "#81F499"
      }
    :
      {
        text: `Underbudget! ${this._overBudget} NOK`, color: "#A71D31"
      };
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  navigate(route: string, clearHistory: boolean = false): void {
    this._routerExtensions.navigate([route], {
      animated: true,
      clearHistory,
      transition: {
        name: "slideLeft",
        duration: 200,
        curve: "ease"
      }
    }).catch((error) => {
      console.log(error);
      alert({
        title: "Route Failure!",
        okButtonText: "OK",
        message: `Route [${route}] does not exist`
      });
    });
  }
}
