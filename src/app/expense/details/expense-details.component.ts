import { Component, OnInit } from "@angular/core";
import { Category } from "~/app/categories/shared/cetegory.model";

import { CategoryService } from "~/app/categories/shared/category.service";
import { Expense } from "../shared/expense.model";
import { ExpenseService } from "../shared/expense.service";

import { Kinvey } from "kinvey-nativescript-sdk";
import { Page } from "tns-core-modules/ui/page/page";
import { RouterExtensions } from "nativescript-angular";

@Component({
  selector: "ExpenseDetails",
  moduleId: module.id,
  templateUrl: "./expense-details.component.html",
  styleUrls: ["./expense-details.component.scss"]
})
export class ExpenseDetailsComponent implements OnInit {
  _isLoading: boolean = false;
  monthlyTransactions: Array<object> = [];
  transactions: Array<any> = [];

  constructor(
    private _expenseService: ExpenseService,
    private _categoryService: CategoryService,
    private page: Page,
    private router: RouterExtensions
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit(): void {
    this._isLoading = true;
    this._expenseService.getUserTransactionWithoutGrouping(Kinvey.User.getActiveUser()._id)
    .then((transactions: Array<Expense>) => {
      this._categoryService.load().then((categories: Array<Category>) => {
        this.perpareTransactions(transactions)
        .then((groupedTransactions: Array<any>) => {
          this.transactions = groupedTransactions;
          this._isLoading = false;
        })
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

    return `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
  }

  perpareTransactions(expenses: Array<Expense>): Promise<Array<any>> {
    const transactions = [];
    let groupDate: Date;
    return new Promise((resolve) => {
      expenses.forEach((expense) => {
        const transactionDate = new Date(expense.kmd.lmt);
        console.log('Transaction date is ', transactionDate);
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
          console.log(transactionDate.getDate(), ' < ', groupDate.getDate());
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

      resolve(transactions);
    });
  }

  goBack(): void {
    this.router.back();
  }
}
