import { Component, OnInit } from "@angular/core";
import { ExpenseService } from "../../expense/shared/expense.service";
import { DataService } from "../../shared/data.service";
import { Category } from "../../categories/shared/cetegory.model";
import { Kinvey } from "kinvey-nativescript-sdk";
import { CategoryService } from "../../categories/shared/category.service";
import { Expense } from "../../expense/shared/expense.model";
import { UtilService } from "~/app/shared/utils.service";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular";

@Component({
  selector: "general-stats",
  moduleId: module.id,
  templateUrl: "./general-stats.component.html",
  styleUrls: ["./general-stats.component.scss"]
})
export class GeneralStatsComponent implements OnInit {
  _isLoading = false;
  expenseOverview: Array<any> = [];
  pieChartData: Array<any> = [];
  donutColorData: Array<any> = [];

  private data: DataService;
  private categoriesIcons: {};
  private categoryNames: {};
  private categoryKeys: {};
  private categoryColors: {};
  private selectedStatsMonth;
  private selectedStatsYear;

  public getBadgeIcon(id: string) {
    return this.categoriesIcons[id];
  }

  public getCategoryName(id: string) {
    return this.categoryNames[id];
  }

  public getCategoryKey(id: string) {
    return this.categoryKeys[id];
  }

  public getCategoryColor(id: string) {
    return this.categoryColors[id];
  }

  get getSelectedPeriod() {
    return `${UtilService.getMonthName(this.selectedStatsMonth - 1)} ${this.selectedStatsYear}`
  }

  constructor(
    private _expenseService: ExpenseService,
    private _categoryService: CategoryService,
    private page: Page,
    private router: RouterExtensions
  ) {
    this.data = new DataService();
    this.categoriesIcons = this.data.getCategoriesIcons()
    this.categoryNames = this.data.getCategoryNames();
    this.categoryKeys = this.data.getCategoryKeys();
    this.categoryColors = this.data.getCategoryColors();
    this.page.actionBarHidden = true;
  }

  ngOnInit(): void {
    const now = new Date();
    this.selectedStatsMonth = now.getMonth() + 1;
    this.selectedStatsYear = now.getFullYear();
    this.loadMonthStats()
  }

  loadMonthStats(): void {
    this._isLoading = true;
    this._expenseService.getUserTransactions(Kinvey.User.getActiveUser()._id, this.selectedStatsMonth, this.selectedStatsYear)
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
    let totalExpenses = 0;
    const catExpenses = [];
    this.expenseOverview = [];
    this.pieChartData = [];
    categories.forEach((category) => {
      const sum = expenses.reduce((categorySum, expense) => {
        if (expense.categoryId === category.id && expense.isWithdraw) {
          return categorySum + expense.amount;
        } else {
          return categorySum;
        }
      }, 0);
      if (sum > 0) {
        totalExpenses += sum;
        catExpenses.push({
          category: category.id,
          sum,
          name: category.name
        });
      }
    });

    catExpenses.forEach((categoryData) => {
      let percentage = ((categoryData.sum / totalExpenses) * 100).toFixed(2)
      this.expenseOverview.push({
        category: categoryData.category,
        description: `${percentage} % (${categoryData.sum} NOK)`,
        sum: categoryData.sum
      });
      this.pieChartData.push({ name: categoryData.name, ammount: percentage });
    });

    this.donutColorData = [...this.expenseOverview];
    this.expenseOverview.sort((a, b) => (a.sum > b.sum) ? 1 : ((b.sum > a.sum) ? -1 : 0)).reverse();

    this._isLoading = false;
  }

  prevMonthStats(): void {
    if (this.selectedStatsMonth === 1) {
      this.selectedStatsMonth = 12;
      this.selectedStatsYear = this.selectedStatsYear - 1;
    } else {
      this.selectedStatsMonth = this.selectedStatsMonth - 1;
    }
    this.loadMonthStats()
  }

  nextMonthStats(): void {
    if (this.selectedStatsMonth === 12) {
      this.selectedStatsMonth = 1;
      this.selectedStatsYear = this.selectedStatsYear + 1;
    } else {
      this.selectedStatsMonth = this.selectedStatsMonth + 1;
    }
    this.loadMonthStats()
  }

  goBack(): void {
    this.router.back();
  }
}
