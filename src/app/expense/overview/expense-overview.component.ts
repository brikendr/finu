import { Component, OnInit } from "@angular/core";
import { ExpenseService } from "../shared/expense.service";
import { CategoryService } from "~/app/categories/shared/category.service";
import { Kinvey } from "kinvey-nativescript-sdk";
import { Expense } from "../shared/expense.model";
import { Category } from "~/app/categories/shared/cetegory.model";

@Component({
  selector: "ExpenseOverview",
  moduleId: module.id,
  templateUrl: "./expense-overview.component.html",
  styleUrls: ["./expense-overview.component.scss"]
})
export class ExpenseOverview implements OnInit {
  _isLoading: boolean = false;
  expenseOverview: Array<Object> = [];
  constructor(
    private _expenseService: ExpenseService,
    private _categoryService: CategoryService,
  ) { }

  ngOnInit(): void {
    this._isLoading = true;

    this._expenseService.groupByCategory(Kinvey.User.getActiveUser()._id)
    .then((expenses: Array<Expense>) => {
      this._categoryService.load().then((categories: Array<Category>) => {
        this.groupByExpenses(expenses, categories);
      })
      .catch(() => {
        this._isLoading = false;
      });
    });
  }

  groupByExpenses(expenses: Array<Expense>, categories: Array<Category>) {
    categories.forEach(category => {
      const sum = expenses.reduce((categorySum, expense) => {
        if (expense.categoryId === category.id && expense.isWithdraw) {
          return categorySum + expense.amount;
        } else {
          return categorySum;
        }
      }, 0);
      this.expenseOverview.push({
        description: category.description,
        bg_color: category.color,
        icon: String.fromCharCode(parseInt(category.logo, 16)),
        total: `${sum} NOK`
      });
    });
    this._isLoading = false;
  }
}
