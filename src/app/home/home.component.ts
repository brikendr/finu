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
import { Page, Color } from "tns-core-modules/ui/page";

import { Progress } from "tns-core-modules/ui/progress";
import { Expense } from "../expense/shared/expense.model";

import { Feedback, FeedbackPosition, FeedbackType } from "nativescript-feedback";

@Component({
  selector: "Home",
  moduleId: module.id,
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  private feedback: Feedback;

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
  _savingsGoal: number;
  _dailyBudget: number;
  _maintainedSavings: number;
  _overBudget: number;
  _unpaidBills: number;


  expensesOnBalance: string;
  expensesOnBudget: string;
  transactions: Array<any> = [];

  constructor(
    private _routerExtensions: RouterExtensions,
    private _budgetPlanService: BudgetPlanService,
    private _expenseService: ExpenseService,
    private _billService: BillService,
    private _billRecordSerivce: BillRecordService,
    private page: Page
  ) {
    this.page.backgroundSpanUnderStatusBar = true;
    this.page.backgroundColor = '#f1f5f8';
    this.feedback = new Feedback();
  }

  get totalEarned(): string {
    return `${this._earned} NOK`;
  }

  get monthlyBudget(): string {
    const budgetTotal = Math.round(this._earned - this._savingsGoal - this._totalExpenses);

    return `Budget: ${budgetTotal} NOK`;
  }

  get maintainedSavings(): string {
    return `${this._maintainedSavings} NOK`;
  }

  get dailyBudget(): string {
    return this._dailyBudget > 0 ? `${this._dailyBudget} NOK` : "0 NOK";
  }

  get unpaidBills(): number {
    return this._unpaidBills;
  }

  get currentDayMonth(): string {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const now = new Date();

    return `${now.getDate()} ${monthNames[now.getMonth()]}`;
  }

  ngOnInit(): void {
    if (Kinvey.User.getActiveUser() === null) {
      this.navigate("login", true);
    }
    this.fetchDataAndPopulateView();
  }

  fetchDataAndPopulateView(): Promise<any> {
    this._isProcessing = true;
    const userId = Kinvey.User.getActiveUser()._id;

    return new Promise((resolve, reject) => {
      this._budgetPlanService.getUserBudgetPlan(userId)
        .then((plan: BudgetPlan) => {
          this._income = plan.netIncome;
          this._savingsGoal = plan.savingsGoal;

          this._expenseService.getUserTransactions(userId)
            .then((transactions: any) => {
              this.perpareTransactions(transactions.all)
              .then((groupedTransactions: Array<any>) => {
                this.transactions = groupedTransactions;
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
                this.expensesOnBalance = `${Math.round(this._totalExpenses)} NOK`;
                this.calculateDailyBudget();
                // this.calculatePlannedExpenses();
                this.calculateRemainingBills();
                resolve();
              })
            });
        })
        .catch((error) => {
          console.log("Error initializing home components!", error);
          reject();
          this._isProcessing = false;
        });
    });
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

  // calculatePlannedExpenses() {
  //   const now = new Date();
  //   const currentDay = now.getDate();
  //   const daysInCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  //   const budgetTotal = Math.round(this._earned - this._savingsGoal);

  //   const plannedDailyBudget = budgetTotal / daysInCurrentMonth;
  //   const plannedExpenses = currentDay * plannedDailyBudget;
  //   this._overBudget = plannedExpenses - this._totalExpenses;
  // }

  calculateRemainingBills() {
    let unpaidBills = 0;
    const dayOfMonth = new Date().getDate();
    const avtaleBills = [];
    this._billService.loadUserBills(Kinvey.User.getActiveUser()._id)
      .then((bills: Array<Bill>) => {
        this._billRecordSerivce.getUserMonthlyBillRecords(Kinvey.User.getActiveUser()._id)
          .then((billRecords: Array<BillRecord>) => {
            bills.forEach((bill) => {
              const paidBill = billRecords.find((record) => record.billId === bill.id);
              if (!paidBill && !bill.isAvtale && bill.deadlineDay <= dayOfMonth) {
                unpaidBills += 1;
              } else if (!paidBill && bill.isAvtale && bill.deadlineDay <= dayOfMonth) {
                avtaleBills.push(bill);
              }
            });
            this.handleAvtaleBills(avtaleBills);
            this.notifyAboutUnpaidBills(unpaidBills);
          }).catch(() => {
            this.feedback.error({
              title: "Uh-oh!",
              message: "Unable to get monthly bills!"
            });
          });
      }).catch(() => {
        this.feedback.error({
          title: "Uh-oh!",
          message: "Unable to load bills!"
        });
      });
  }

  notifyAboutUnpaidBills(unpaidBills: number): void {
    this._unpaidBills = unpaidBills;
    if (unpaidBills > 0) {
      this.feedback.show({
        title: "Unpaid Bills",
        titleColor: new Color("white"),
        position: FeedbackPosition.Bottom, // iOS only
        type: FeedbackType.Warning, // this is the default type, by the way
        message: `You have in total ${unpaidBills} unpaid bills this month. Click the bell to go to the bills page`,
        duration: 10000,
        backgroundColor: new Color("#EF3054")
      });
    }
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
      this.feedback.error({
        title: "Route Failure!",
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

  refreshList(args) {
    const pullRefresh = args.object;
    this.fetchDataAndPopulateView().then(() => {
      pullRefresh.refreshing = false;
    }).catch((e) => {
      pullRefresh.refreshing = false;
    });
  }

  perpareTransactions(transactionList: Array<Expense>): Promise<Array<any>> {
    const transactions = [];
    let groupDate: Date;
    return new Promise((resolve) => {
      transactionList.reverse().forEach((expense) => {
        const transactionDate = new Date(expense.kmd.lmt);
        if (!groupDate) {
          groupDate = transactionDate;
          transactions.push({
            itemType: 'header',
            date: transactionDate
          });
          transactions.push({
            itemType: 'transaction',
            category: expense.categoryId,
            ammount: expense.isWithdraw ? (expense.amount * -1) : expense.amount,
            comment: expense.comment
          })
        } else {
          if (transactionDate.getDate() < groupDate.getDate()) {
            groupDate = transactionDate;
            transactions.push({
              itemType: 'header',
              date: transactionDate
            });
          }
          transactions.push({
            itemType: 'transaction',
            category: expense.categoryId,
            ammount: expense.isWithdraw ? (expense.amount * -1) : expense.amount,
            comment: expense.comment
          })
        }
      });
      const topTen = transactions.slice(0, 8);
      resolve(topTen);
    });
  }

  handleAvtaleBills(avtaleBills: Array<Bill>): void {
    const billDate = new Date();
    const promises = [];
    avtaleBills.forEach((bill) => {
      const expenseOpts = {
        userId: Kinvey.User.getActiveUser()._id,
        dateTime: billDate.getTime().toString(),
        month: billDate.getMonth() + 1,
        amount: bill.amount,
        isWithdraw: true,
        comment: `Bill Expense for ${bill.name}`,
        categoryId: bill.categoryId
      };
      const newExpense = new Expense(expenseOpts);
      promises.push(new Promise((resolve, reject) => {
        this._expenseService.save(newExpense)
        .then((entry) => {
          const billRecord = new BillRecord({
            userId: Kinvey.User.getActiveUser()._id,
            billId: bill.id,
            expenseId: entry.id,
            dateTime: billDate.getTime().toString()
          });
          this._billRecordSerivce.save(billRecord)
          .then(() => resolve())
          .catch((e) => reject('Could not add bill record for the avtale transaction'));
        }).catch((e) => {
          reject('Could not add transaction for avtale bill!');
        });
      }));
    });
    Promise.all(promises)
    .catch((e) => {
      this.feedback.error({
        title: "Uh-oh!",
        message: e
      });
    });
  }

  onExpensesLoaded(args: any) {
    const myProgressBar = <Progress>args.object;
    myProgressBar.value = Math.floor(((this._totalExpenses / this._income) * 100));
    myProgressBar.maxValue = 100;
  }

  onLastMonthExpensesLoaded(args: any) {
    const myProgressBar = <Progress>args.object;
    myProgressBar.value = 35;
    myProgressBar.maxValue = 100;
  }
  onSavingsLoaded(args: any) {
    const myProgressBar = <Progress>args.object;
    myProgressBar.value = Math.floor((this._maintainedSavings / this._savingsGoal) * 100);
    myProgressBar.maxValue = 100;
  }
}
