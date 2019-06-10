import { Kinvey } from "kinvey-nativescript-sdk";
import { UtilService } from "~/app/shared/utils.service";
import { Expense } from "./expense.model";

import { Injectable } from "@angular/core";

@Injectable()
export class ExpenseService {
  private expenseStore = Kinvey.DataStore.collection("expense-new", Kinvey.DataStoreType.Cache);
  private monthlyTransactions: object = {};
  private allTransactions: Array<Expense> = [];

  getUserTransactions(userId: string, month: number = (new Date().getMonth() + 1), year: number = new Date().getFullYear()): Promise<any> {
    const query = new Kinvey.Query();
    query.equalTo("userId", userId)
    .and().equalTo("month", month)
    .and().equalTo("year", year);

    return new Promise((resolve, reject) => {
      this.expenseStore.find(query)
        .subscribe((data: any) => {
          this.monthlyTransactions = {};
          const expenses = [];
          const deposits = [];
          const all = [];
          data.forEach((expenseData: any) => {
            expenseData.id = expenseData._id;
            const expense = new Expense(expenseData);
            if (expense.isWithdraw) {
              expenses.push(expense);
            } else {
              deposits.push(expense);
            }
            all.push(expense);
          });
          this.monthlyTransactions = {
            expenses,
            deposits,
            all
          };
        }, (error: Kinvey.BaseError) => {
          reject("Unable to fetch expenses!");
        }, () => {
          resolve(this.monthlyTransactions);
        });
    });
  }

  getTotalExpensesUpUntilToday(userId: string, month: number): Promise<any> {
    const today = new Date();
    const query = new Kinvey.Query();
    query.equalTo("userId", userId)
    .and().equalTo("month", month)
    .and().equalTo("year", today.getFullYear())
    .and().equalTo('isWithdraw', true);
    let totalExpenses: number = 0;
    return new Promise((resolve, reject) => this.expenseStore.find(query)
      .subscribe((data: Array<any>) => {
        totalExpenses = 0;
        data.forEach((expenseData: any) => {
          const expenseDate = new Date(expenseData._kmd.lmt);
          if (expenseDate.getDate() <= today.getDate()) {
            totalExpenses += expenseData.amount
          }
        });
      },
      (error: Kinvey.BaseError) => reject("Unable to fetch expenses!"),
      () => resolve(totalExpenses))
    )
  }

  getUserTransactionWithoutGrouping(userId: string): Promise<Array<Expense>> {
    const month = new Date().getMonth();
    const today = new Date();
    const query = new Kinvey.Query();
    query.equalTo("userId", userId)
    .and().equalTo("month", (month + 1))
    .and().equalTo("year", today.getFullYear());
    query.descending("_kmd");

    return new Promise((resolve, reject) => {
      this.expenseStore.find(query)
        .subscribe((transactionList: any) => {
          this.allTransactions = [];
          transactionList.forEach((transactionData: any) => {
            transactionData.id = transactionData._id;
            const transaction = new Expense(transactionData);
            this.allTransactions.push(transaction);
          });
        }, (error: Kinvey.BaseError) => {
          reject("Unable to fetch expenses!");
        }, () => {
          resolve(this.allTransactions);
        });
    });
  }

  groupTransactionsByCategory(userId: string, year: number, categoryId?: string): Promise<Array<Expense>> {
    const firstDayOfYear = new Date();
    firstDayOfYear.setFullYear(year);
    firstDayOfYear.setMonth(0);
    firstDayOfYear.setDate(1);
    firstDayOfYear.setHours(0);
    firstDayOfYear.setMinutes(0);

    const query = new Kinvey.Query();
    query.equalTo("userId", userId)
    .and().equalTo("isWithdraw", true)
    .and().greaterThanOrEqualTo("month", 1)
    .and().lessThanOrEqualTo("month", 12)
    .and().equalTo("year", year)
    if (categoryId) {
      query.and().equalTo("categoryId", categoryId);
    }
    query.descending("_kmd");
    let list = [];
    return new Promise((resolve, reject) => {
      this.expenseStore.find(query)
        .subscribe((transactionList: any) => {
          list = [];
          transactionList.forEach((transactionData: any) => {
            transactionData.id = transactionData._id;
            const transaction = new Expense(transactionData);
            list.push(transaction);
          });
        }, (error: Kinvey.BaseError) => {
          reject("Unable to fetch expenses!");
        }, () => {
          resolve(list);
        });
    });
  }

  save(expense: Expense): Promise<Expense> {
    return UtilService.isUserLoggedIn()
      .then(() => this.expenseStore.save({
        userId: expense.userId,
        dateTime: expense.dateTime,
        month: expense.month,
        year: expense.year,
        amount: expense.amount,
        comment: expense.comment,
        isWithdraw: expense.isWithdraw,
        categoryId: expense.categoryId
      }).then(() => {
        return expense;
      }).catch((error: Kinvey.BaseError) => {
        throw new Error("Unable to save entry!");
      }));
  }
}
