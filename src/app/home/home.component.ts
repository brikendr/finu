import { Component, OnInit } from "@angular/core";

import * as app from "application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";

import { RouterExtensions } from "nativescript-angular/router";
import { BudgetPlan } from "../budgetplan/shared/budgetplan.model";
import { BudgetPlanService } from "../budgetplan/shared/budgetplan.service";

import { Bill } from "../bills/shared/bill.model";
import { BillService } from "../bills/shared/bill.service";
import { BillRecord } from "../bills/shared/billrecord.model";
import { BillRecordService } from "../bills/shared/billrecord.service";

import { Kinvey } from "kinvey-nativescript-sdk";
import { ExpenseService } from "../expense/shared/expense.service";
import { UtilService } from "../shared/utils.service";

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
  _pendingBillsLabelTxt: string = "Loading...";
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
    private _expenseService: ExpenseService,
    private _billService: BillService,
    private _billRecordSerivce: BillRecordService
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

        this._expenseService.getUserTransactions(userId)
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
            this.calculateRemainingBills();
          });
      })
      .catch((error) => {
        console.log("Error initializing home components!", error);
        this._isProcessing = false;
      });
  }

  calculateExpensesOnBalance() {
    let progress = (this._totalExpenses / this._income) * 100;
    progress = progress > 100 ? 100 : progress;
    this.expenseProgressBar = progress + "*," + (100 - progress) + "*";
    this.expensesOnBalance = `${Math.round(this._totalExpenses)} NOK`;
  }

  calculateExpensesOnBudget() {
    const budget = this._income - this._savingsGoal;
    let progress = (this._totalExpenses / budget) * 100;
    progress = progress > 100 ? 100 : progress;
    this.budgetProgressBar = progress + "*," + (100 - progress) + "*";
    this.expensesOnBudget = `${Math.round(this._totalExpenses)} NOK`;
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

  calculateRemainingBills() {
    let unpaidBills = 0;
    this._billService.loadUserBills(Kinvey.User.getActiveUser()._id)
      .then((bills: Array<Bill>) => {
        this._billRecordSerivce.getUserMonthlyBillRecords(Kinvey.User.getActiveUser()._id)
          .then((billRecords: Array<BillRecord>) => {
            bills.forEach((bill) => {
              const paidBill = billRecords.find((record) => record.billId === bill.id);
              if (!paidBill && !bill.isAvtale) {
                // Unpaid bill that is not an avtale!
                unpaidBills += 1;
              }
            });
            if (unpaidBills > 0) {
              this._pendingBillsLabelTxt = unpaidBills === 1 ?
              `${unpaidBills} Pending Bill` : `${unpaidBills} Pending Bills`;
            } else {
              this._pendingBillsLabelTxt = "All Paid";
            }
          }).catch(() => {
            this._pendingBillsLabelTxt = "Error!";
          });
      }).catch(() => {
        this._pendingBillsLabelTxt = "Error!";
      });
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
    return this._pendingBillsLabelTxt;
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
    if (this._overBudget) {
      return this._overBudget > 0 ?
        {
          text: `Overbudget! + ${this._overBudget.toFixed(2)} NOK`, color: "#81F499"
        }
        :
        {
          text: `Underbudget! ${this._overBudget.toFixed(2)} NOK`, color: "#A71D31"
        };
    }

    return {text: "", color: ""};
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
      alert({
        title: "Route Failure!",
        okButtonText: "OK",
        message: `Route [${route}] does not exist`
      });
    });
  }

  navigateWithParams(route: string, parameter: any): void {
    this._routerExtensions.navigate([route, parameter],
      {
        animated: true,
        transition: {
          name: "slide",
          duration: 200,
          curve: "ease"
        }
      });
  }
}
