import { Component, OnInit } from "@angular/core";

import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular/router";
import { Kinvey } from "kinvey-nativescript-sdk";
import { ListViewEventData } from "nativescript-ui-listview";

import { registerElement } from 'nativescript-angular/element-registry';
import { CardView } from 'nativescript-cardview';
registerElement('CardView', () => CardView);

class NavigatableElement {
  constructor(
    public name: string,
    public path: string,
    public icon: string) { }
}

let elements = [
  {
    name: "categories",
    path: "/home/categories",
    icon: String.fromCharCode(parseInt('f061', 16))
  }, {
    name: "expense",
    path: "home/newexpense",
    icon: String.fromCharCode(parseInt('f061', 16))
  }, {
    name: "currencies",
    path: "home/currencies",
    icon: String.fromCharCode(parseInt('f061', 16))
  }
];

@Component({
  selector: "Home",
  moduleId: module.id,
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  private _navigatable: Array<NavigatableElement>;
  balanceProgressBar: string;
  budgetProgressBar: string;

  /* Collection Retrivable Data */
  totalExpenses: number;
  income: number;
  _pendingBills: number;
  savingsGoal: number;
  _dailyBudget: number;
  _maintainedSavings: number;

  /* Progress bar values */
  expensesOnBalance: string;
  expensesOnBudget: string;

  constructor(
    private _routerExtensions: RouterExtensions,
    private page: Page
  ) {
    // this.page.actionBarHidden = true;
    this.page.backgroundSpanUnderStatusBar = true;
    this.page.className = "homepage-container";
    // this.page.statusBarStyle = "dark";

    this._navigatable = [];
    elements.forEach(item => {
      this._navigatable.push(new NavigatableElement(item.name, item.path, item.icon));
    });
  }

  ngOnInit(): void {
    /* Initialize properties */
    this.totalExpenses = 16500;
    this.income = 25400;
    this.savingsGoal = 10000;
    this._pendingBills = 3;

    const d = this.totalExpenses + this.savingsGoal;
    this._maintainedSavings = d > this.income ? this.savingsGoal - (d - this.income): this.savingsGoal;

    this.calculateMonthlyBalance();
    this.calculateMonthlyBudget();
    this.calculateDailyBudget();
  }

  calculateMonthlyBalance() {
    let percent = 0;
    let progress = (this.totalExpenses / this.income) * 100;
    progress = progress > 100 ? 100 : progress;
    let incExpense = 0;
    let intervalId = setInterval(() => {
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
    const budget = this.income - this.savingsGoal; //15400
    let progress = (this.totalExpenses / budget) * 100;
    progress = progress > 100 ? 100 : progress;
    let incExpense = 0;
    let intervalId = setInterval(() => {
      this.animateBudgetProgressBar(percent);
      percent++;
      incExpense += (this.totalExpenses / progress);
      this.expensesOnBudget = `${Math.round(incExpense)} NOK`;

      if (percent > progress) {
        this.expensesOnBudget = `${Math.round(this.totalExpenses)} NOK`;
        clearInterval(intervalId);
      }
    }, 50);
  }

  animateBudgetProgressBar(percent) {
    this.budgetProgressBar = percent + "*," + (100 - percent) + "*";
  }

  calculateDailyBudget() {
    const now = new Date();
    const daysInCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const today = now.getDate();
    const budgetTotal = Math.round(this.income - this.savingsGoal - this.totalExpenses);
    const daysLeft = daysInCurrentMonth - today;
    this._dailyBudget = Math.round(budgetTotal / daysLeft);
  }

  get navigatable(): Array<NavigatableElement> {
    return this._navigatable;
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
    return this._dailyBudget > 0 ? `${this._dailyBudget} NOK` : '0 NOK'
  }
 
  get currentDayMonth(): string {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const now = new Date();
    return `${now.getDate()} ${monthNames[now.getMonth()]}`;
  }

  onNavigatableTap(args: ListViewEventData): void {
    const tappedItem = args.view.bindingContext;
    this._routerExtensions.navigate([tappedItem.path], {
      animated: true,
      transition: {
        name: "slideRight",
        duration: 200,
        curve: "ease"
      }
    })
    .catch(() => {
      return alert({
        title: "Route Failure",
        okButtonText: "OK",
        message: `Route ${tappedItem.path} is not defined yet!`
      });
    });
  }

  logout(): void {
    Kinvey.User.logout()
      .then(() => {
        this._routerExtensions.navigate(["login"],
          {
            clearHistory: true,
            animated: true,
            transition: {
              name: "slideBottom",
              duration: 350,
              curve: "ease"
            }
          });
      });
  }
}
