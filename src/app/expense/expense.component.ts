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
import { Progress } from "tns-core-modules/ui/progress";
import { DataService } from "../shared/data.service";

@Component({
  selector: "Expense",
  moduleId: module.id,
  templateUrl: "./expense.component.html",
  styleUrls: ["./expense.component.scss"]
})
export class ExpenseComponent implements OnInit {
  selectedCategory: string;
  expenseAmount: string = "";
  expenseComment: string = "";
  isWithdraw: boolean = true;
  
  totalTabs: number = 5;
  activeTab: number = 1;
  expenseProgressCols: string;
  summaryTxt: any = {};
  _isLoading = false;

  private data: DataService;
  private _categories: Array<Category> = [];
  private feedback: Feedback;
  private categoriesIcons: {};
  private categoryNames: {}
  private categoryKeys: {}

  constructor(
    private _categoryService: CategoryService,
    private _expenseService: ExpenseService,
    private router: RouterExtensions,
    private page: Page
  ) {
    this.feedback = new Feedback();
    this.data = new DataService();
    this.categoriesIcons = this.data.getCategoriesIcons()
    this.categoryNames = this.data.getCategoryNames();
    this.categoryKeys = this.data.getCategoryKeys();
  }

  public getBadgeIcon(id: string) {
    return this.categoriesIcons[id];
  }

  public getCategoryName(id: string) {
    return this.categoryNames[id];
  }

  public getCategoryKey(id: string) {
    return this.categoryKeys[id];
  }

  get categories(): Array<Category> {
    return this._categories;
  }

  ngOnInit(): void {
    this._isLoading = true;
    this.setProgressbarWidth(1);

    this._categoryService.load()
      .then((categories: Array<Category>) => {
        this._categories = categories;
        this._isLoading = false;
      })
      .catch(() => {
        this._isLoading = false;
      });
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
        categoryId: this.selectedCategory
      };
      const newExpense = new Expense(expenseOpts);
      this._isLoading = true;
      this._expenseService.save(newExpense).then((expenseEntry) => {
        this._isLoading = false;
        this.summaryTxt = {
          title: "Hurra!!!",
          message: "Your transaction is added successfully to the app!",
          icon: 'tada.png'
        };
        this.setProgressbarWidth(5);
        setTimeout(() => {
          this.router.navigate(['/home'], {
            animated: true,
            transition: {
              curve: "linear",
              duration: 300,
              name: "fadeOut"
            },
            clearHistory: true
          })
        }, 3000);
      }).catch((error) => {
        this.summaryTxt = {
          title: "Uh-oh!",
          message: `Something went wrong while adding a new expense!\n\n${error.message}`,
          icon: 'oh-oh.png'
        };
        this.setProgressbarWidth(5);
        this._isLoading = false;
      });
    }
  }

  transactionType(type: string): void {
    this.isWithdraw = type === 'expense';
    this.setProgressbarWidth(2);
    setTimeout(() => {
      const textField = <TextField>this.page.getViewById("expenseInput");
      new NumericKeyboard().decorate({
        textField,
        returnKeyTitle: "OK",
        locale: "en_US", // or "nl_NL", or any valid locale really (to define the decimal char)
        // noReturnKey: false,
        noDecimals: true,
        noIpadInputBar: true // suppress the bar with buttons iOS renders on iPad since iOS 9
      });
      textField.focus();
    }, 500)
  }

  showCategoryTab(): void {
    this.setProgressbarWidth(3);
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.setProgressbarWidth(4);
    setTimeout(() => {
      let focusTextField: TextField = <TextField>this.page.getViewById("commentInput");
      focusTextField.focus();
    }, 500)
  }

  showSummaryTab(): void {
    if (this.expenseComment.trim() === "") {
      return;
    }
    this.submit()
  }

  setProgressbarWidth(tabToActivate: number) {
    this.activeTab = tabToActivate;
    const percent = (this.activeTab / this.totalTabs) * 100;
    this.expenseProgressCols = percent + "*," + (100 - percent) + "*";
  }
}
