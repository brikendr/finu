import { Kinvey } from "kinvey-nativescript-sdk";
import { UtilService } from "~/app/shared/utils.service";
import { Expense } from "./expense.model";
import { Injectable } from "@angular/core";

@Injectable()
export class ExpenseService {
  private expenseStore = Kinvey.DataStore.collection("expense", Kinvey.DataStoreType.Cache);

  save(expense: Expense): Promise<Expense> {
    console.log('-- Saving --');
    console.log(expense);
    return UtilService.isUserLoggedIn()
      .then(() => this.expenseStore.save({
        userId: expense.userId,
        dateTime: expense.dateTime,
        amount: expense.amount,
        isWithdraw: expense.isWithdraw,
        categoryId: expense.categoryId
      }).then(() => {
        return expense;
      }).catch((error: Kinvey.BaseError) => {
        throw new Error('Unable to save entry');
      }));
  }
}