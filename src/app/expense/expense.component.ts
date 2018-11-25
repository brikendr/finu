import { Component, OnInit } from "@angular/core";
import { SelectedIndexChangedEventData, ValueList } from "nativescript-drop-down";
import { Page } from "tns-core-modules/ui/page";

import { alert } from "ui/dialogs";
import { CategoryService } from "../categories/shared/category.service";
import { Category } from "../categories/shared/cetegory.model";
import { Expense } from "./shared/expense.model";
import { ExpenseService } from "./shared/expense.service";

import { Kinvey } from "kinvey-nativescript-sdk";
import { RouterExtensions } from "nativescript-angular/router";

import { NumericKeyboard } from "nativescript-numeric-keyboard";
import { TextField } from "tns-core-modules/ui/text-field/text-field";

import { Feedback } from "nativescript-feedback";

@Component({
  selector: "Expense",
  moduleId: module.id,
  templateUrl: "./expense.component.html",
  styleUrls: ["./expense.component.scss"]
})
export class ExpenseComponent implements OnInit {
  title: string = "New Transaction";
  selectedIndex = 1;
  processing = false;
  expenseAmount: string = "";
  expenseComment: string = "";
  isWithdraw: boolean = true;
  private _categories: ValueList<string> = new ValueList<string>();
  private feedback: Feedback;

  constructor(
    private _categoryService: CategoryService,
    private _expenseService: ExpenseService,
    private _routerExtensions: RouterExtensions,
    private page: Page
  ) {
    this.feedback = new Feedback();
  }

  ngOnInit(): void {
    this.processing = true;

    this._categoryService.load()
      .then((categories: Array<Category>) => {
        categories.forEach((category) => {
          this._categories.push({
            value: category.id,
            display: category.name
          });
        });
        const textField = <TextField>this.page.getViewById("expenseInput");
        new NumericKeyboard().decorate({
          textField,
          returnKeyTitle: "OK",
          locale: "en_US", // or "nl_NL", or any valid locale really (to define the decimal char)
          // noReturnKey: false,
          noDecimals: true,
          noIpadInputBar: true // suppress the bar with buttons iOS renders on iPad since iOS 9
        });
        this.processing = false;
      })
      .catch(() => {
        this.processing = false;
      });
  }

  onchange(args: SelectedIndexChangedEventData) {
    console.log(`Drop Down selected index changed from ${args.oldIndex} to ${args.newIndex}`);
  }

  onopen() {
    console.log("Drop Down opened.");
  }

  onclose() {
    console.log("Drop Down closed.");
  }

  submit(): void {
    if (isNaN(parseInt(this.expenseAmount, 10))) {
      alert(`The given amount [${this.expenseAmount}] must be a valid number!`);

      return;
    } else {
      const dateTime = new Date().getTime();
      const expenseOpts = {
        userId: Kinvey.User.getActiveUser()._id,
        dateTime: dateTime.toString(),
        month: new Date().getMonth() + 1,
        amount: parseInt(this.expenseAmount, 10),
        isWithdraw: this.isWithdraw,
        comment: this.expenseComment,
        categoryId: this.isWithdraw ? this._categories.getValue(this.selectedIndex) : undefined
      };
      const newExpense = new Expense(expenseOpts);
      this.processing = true;
      this._expenseService.save(newExpense).then((expenseEntry) => {
        this.feedback.success({
          title: "Success!",
          message: "Transaction has been completed!"
        });
        setTimeout(() => {
          this.expenseAmount = "";
          this.expenseComment = "";
          this.processing = false;
        }, 2000);
      }).catch((error) => {
        this.feedback.error({
          title: "Uh-oh!",
          message: "Something went wrong while adding a new expense!"
        });
        this.processing = false;
      });
    }
  }

  get categories(): ValueList<string> {
    return this._categories;
  }

  goToOverviewScreen() {
    this._routerExtensions.navigate(["/expense/expense-overview"], {
      animated: true,
      transition: {
        name: "slide",
        duration: 200,
        curve: "ease"
      }
    });
  }
}
