import { Component, OnInit } from "@angular/core";
import { ExpenseService } from "../shared/expense.service";

import { CategoryService } from "~/app/categories/shared/category.service";

import { Kinvey } from "kinvey-nativescript-sdk";
import { Expense } from "../shared/expense.model";

import { Category } from "~/app/categories/shared/cetegory.model";
import { UtilService } from "~/app/shared/utils.service";

@Component({
  selector: "ExpenseOverview",
  moduleId: module.id,
  templateUrl: "./expense-overview.component.html",
  styleUrls: ["./expense-overview.component.scss"]
})
export class ExpenseOverviewComponent implements OnInit {
  _isLoading: boolean = false;
  expenseOverview: Array<object> = [];
  constructor(
    private _expenseService: ExpenseService,
    private _categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this._isLoading = true;

    this._expenseService.getUserExpenses(Kinvey.User.getActiveUser()._id)
    .then((transactions: any) => {
      this._categoryService.load().then((categories: Array<Category>) => {
        this.groupByExpenses(transactions.expenses, categories);
      })
      .catch(() => {
        this._isLoading = false;
      });
    });
  }

  groupByExpenses(expenses: Array<Expense>, categories: Array<Category>) {
    categories.forEach((category) => {
      const sum = expenses.reduce((categorySum, expense) => {
        if (expense.categoryId === category.id && expense.isWithdraw) {
          return categorySum + expense.amount;
        } else {
          return categorySum;
        }
      }, 0);
      this.expenseOverview.push({
        name: category.name,
        tileClass: UtilService.generateRandomTileColor(),
        icon: category.logo,
        total: `${sum} NOK`
      });
    });
    this._isLoading = false;
  }
}
