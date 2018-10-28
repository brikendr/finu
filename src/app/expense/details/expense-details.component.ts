import { Component, OnInit } from "@angular/core";
import { Category } from "~/app/categories/shared/cetegory.model";

import { CategoryService } from "~/app/categories/shared/category.service";
import { Expense } from "../shared/expense.model";
import { ExpenseService } from "../shared/expense.service";

import { Kinvey } from "kinvey-nativescript-sdk";
import { UtilService } from "~/app/shared/utils.service";

@Component({
  selector: "ExpenseDetails",
  moduleId: module.id,
  templateUrl: "./expense-details.component.html",
  styleUrls: ["./expense-details.component.scss"]
})
export class ExpenseDetailsComponent implements OnInit {
  _isLoading: boolean = false;
  monthlyTransactions: Array<object> = [];

  constructor(
    private _expenseService: ExpenseService,
    private _categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this._isLoading = true;
    this._expenseService.getUserTransactionWithoutGrouping(Kinvey.User.getActiveUser()._id)
    .then((transactions: Array<Expense>) => {
      this._categoryService.load().then((categories: Array<Category>) => {
        this.composeDetailList(transactions, categories);
      })
        .catch(() => {
          this._isLoading = false;
        });
    });
  }

  get title(): string {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const now = new Date();

    return `${monthNames[now.getMonth()]} Transactions`;
  }

  composeDetailList(expenses: Array<Expense>, categories: Array<Category>): void {

    expenses.forEach((expense) => {
      const item: any = {
        amount: `${expense.amount} NOK`,
        transactionColor: expense.isWithdraw ? "tile-brokes" : "tile-excellesnt",
        isWithdraw: expense.isWithdraw,
        dateTime: UtilService.parseTimeStamp(expense.dateTime),
        comment: expense.comment !== "" ? expense.comment : undefined
      };
      if (expense.isWithdraw) {
        const category = categories.find((cat) => cat.id === expense.categoryId);
        item.categoryName = category.name;
        item.categoryIcon = category.logo;
      } else {
        item.categoryName = "Deposit";
        item.categoryIcon = String.fromCharCode(parseInt("f0d6", 16));
      }
      this.monthlyTransactions.push(item);
    });
    this._isLoading = false;
  }
}
