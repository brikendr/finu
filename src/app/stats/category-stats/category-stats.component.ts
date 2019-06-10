import { Component, OnInit } from "@angular/core";
import { ExpenseService } from "../../expense/shared/expense.service";
import { Category } from "../../categories/shared/cetegory.model";
import { Kinvey } from "kinvey-nativescript-sdk";
import { CategoryService } from "../../categories/shared/category.service";
import { Expense } from "../../expense/shared/expense.model";
import { UtilService } from "~/app/shared/utils.service";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular";
import { DataService } from "~/app/shared/data.service";

@Component({
  selector: "category-stats",
  moduleId: module.id,
  templateUrl: "./category-stats.component.html",
  styleUrls: ["./category-stats.component.scss"]
})
export class CategoryStatsComponent implements OnInit {
  _isLoading: boolean = false;
  lineChartData: any = {};
  categoryList: Array<Category> = [];
  selectedCategory: string = "all";
  
  private selectedStatsYear: number;
  private data: DataService;
  private categoryNames: any = {};

  get getSelectedPeriod() {
    return `${this.selectedStatsYear} ${this.getSelectedCategoryName()}`;
  }

  get lineData() {
    let chartData = [];
    for (let i = 1; i <= 12; i++) {
      let sumOfMonth = 0;
      let monthTransactions: Array<any> = this.lineChartData[i.toString()];
      monthTransactions.forEach(transaction => {
        sumOfMonth += transaction.amount;
      })

      if (sumOfMonth > 0) {
        chartData.push({
          month: UtilService.getMonthName(i - 1),
          amount: sumOfMonth
        });
      }
    }
    return chartData;
  }

  constructor(
    private _expenseService: ExpenseService,
    private _categoryService: CategoryService,
    private page: Page,
    private router: RouterExtensions
  ) {
    this.data = new DataService();
    this.page.actionBarHidden = true;
    this.categoryNames = this.data.getCategoryNames();
  }

  ngOnInit(): void {
    const now = new Date();
    this.selectedStatsYear = now.getFullYear();
    this.loadStats();
  }

  loadStats(categoryId?: string): void {
    this._isLoading = true;
    this.resetLineChartData();
    this._categoryService.load()
    .then((categoryList: Array<Category>) => {
      this.categoryList = categoryList;
      this._expenseService.groupTransactionsByCategory(Kinvey.User.getActiveUser()._id, this.selectedStatsYear, categoryId)
        .then((transactions: Array<Expense>) => {
          transactions.forEach(transaction => {
            this.lineChartData[transaction.month].push({
              category: transaction.categoryId,
              amount: transaction.amount
            });
          });
          this._isLoading = false;
        });
    });
  }

  prevYearStats(): void {
    this.selectedStatsYear = this.selectedStatsYear - 1;
    this.loadStats()
  }

  nextYearStats(): void {
    this.selectedStatsYear = this.selectedStatsYear + 1;
    this.loadStats()
  }

  getSelectedCategoryName(): string {
    if (this.selectedCategory === 'all') {
      return ''
    }
    return this.categoryNames[this.selectedCategory];
  }

  goBack(): void {
    this.router.back();
  }

  resetLineChartData(): void {
    this.lineChartData = {
      "1": [],
      "2": [],
      "3": [],
      "4": [],
      "5": [],
      "6": [],
      "7": [],
      "8": [],
      "9": [],
      "10": [],
      "11": [],
      "12": [],
    };
  }

  filterByCategory(categoryId: string): void {
    if (categoryId === "all") {
      this.loadStats();
    } else {
      this.loadStats(categoryId);
    }
    this.selectedCategory = categoryId;
  }
}
