import { Kinvey } from "kinvey-nativescript-sdk";
import { UtilService } from "~/app/shared/utils.service";
import { Expense } from "./expense.model";

import { Injectable } from "@angular/core";

@Injectable()
export class ExpenseService {
  private expenseStore = Kinvey.DataStore.collection("expense", Kinvey.DataStoreType.Cache);
  private monthlyExpenses: Array<Expense> = [];

  groupByCategory(userId: string): Promise<Array<Expense>> {
    const month = new Date().getMonth();
    const query = new Kinvey.Query();
    query.equalTo("userId", userId).and().equalTo("isWithdraw", true).and().equalTo("month", (month + 1));

    return new Promise((resolve, reject) => {
      this.expenseStore.find(query)
        .subscribe((data: any) => {
          this.monthlyExpenses = [];
          data.forEach((expenseData: any) => {
            expenseData.id = expenseData._id;
            const expense = new Expense(expenseData);

            this.monthlyExpenses.push(expense);
          });
        }, (error: Kinvey.BaseError) => {
          throw new Error("Unable to fetch expenses!");
        }, () => {
          resolve(this.monthlyExpenses);
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
        isWithdraw: expense.isWithdraw,
        categoryId: expense.categoryId
      }).then(() => {
        return expense;
      }).catch((error: Kinvey.BaseError) => {
        throw new Error("Unable to save entry!");
      }));
  }
}
