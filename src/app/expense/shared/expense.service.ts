import { Kinvey } from "kinvey-nativescript-sdk";
import { UtilService } from "~/app/shared/utils.service";
import { Expense } from "./expense.model";

import { Injectable } from "@angular/core";

@Injectable()
export class ExpenseService {
  private expenseStore = Kinvey.DataStore.collection("expense", Kinvey.DataStoreType.Cache);
  private monthlyTransactions: object = {};
  private allTransactions: Array<Expense> = [];

  getUserTransactions(userId: string): Promise<any> {
    const month = new Date().getMonth();
    const query = new Kinvey.Query();
    query.equalTo("userId", userId).and().equalTo("month", (month + 1));

    return new Promise((resolve, reject) => {
      this.expenseStore.find(query)
        .subscribe((data: any) => {
          this.monthlyTransactions = {};
          const expenses = [];
          const deposits = [];
          data.forEach((expenseData: any) => {
            expenseData.id = expenseData._id;
            const expense = new Expense(expenseData);
            if (expense.isWithdraw) {
              expenses.push(expense);
            } else {
              deposits.push(expense);
            }
          });
          this.monthlyTransactions = {
            expenses,
            deposits
          };
        }, (error: Kinvey.BaseError) => {
          reject("Unable to fetch expenses!");
        }, () => {
          resolve(this.monthlyTransactions);
        });
    });
  }

  getUserTransactionWithoutGrouping(userId: string): Promise<Array<Expense>> {
    const month = new Date().getMonth();
    const query = new Kinvey.Query();
    query.equalTo("userId", userId).and().equalTo("month", (month + 1));
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

  save(expense: Expense): Promise<Expense> {
    return UtilService.isUserLoggedIn()
      .then(() => this.expenseStore.save({
        userId: expense.userId,
        dateTime: expense.dateTime,
        month: expense.month,
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
