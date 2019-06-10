import { Component, OnInit } from "@angular/core";
import { ExpenseService } from "../../expense/shared/expense.service";
import { Kinvey } from "kinvey-nativescript-sdk";
import { Expense } from "../../expense/shared/expense.model";
import { UtilService } from "~/app/shared/utils.service";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular";
import { BudgetPlanService } from "~/app/budgetplan/shared/budgetplan.service";
import { BudgetPlan } from "~/app/budgetplan/shared/budgetplan.model";

@Component({
  selector: "saving-stats",
  moduleId: module.id,
  templateUrl: "./saving-stats.component.html",
  styleUrls: ["./saving-stats.component.scss"]
})
export class SavingStatsComponent implements OnInit {
  _isLoading: boolean = false;
  barChartData: any = {};

  private selectedStatsYear: number;
  private income: number = 0;
  savingsGoal: number = 0;
  private _yearlySavings: number = 0;

  get getSelectedPeriod() {
    return this.selectedStatsYear;
  }

  get barData() {
    let chartData = [];
    let totalYearlySavings = 0;
    for (let i = 1; i <= 12; i++) {
      let monthTransactions: Array<any> = this.barChartData[i.toString()];
      if (monthTransactions.length > 0) {
        const sumOfMonth = monthTransactions.reduce((total, sum) => { return total + sum; });
  
        if (sumOfMonth > 0) {
          chartData.push({
            month: UtilService.getMonthName(i - 1),
            amount: (this.income - sumOfMonth)
          });
          totalYearlySavings += (this.income - sumOfMonth);
        }
      }
    }
    this._yearlySavings = totalYearlySavings;
    return chartData;
  }

  get yearlySavings() {
    return `${this._yearlySavings} NOK`;
  }

  constructor(
    private _expenseService: ExpenseService,
    private _budgetPlanService: BudgetPlanService,
    private page: Page,
    private router: RouterExtensions
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit(): void {
    const now = new Date();
    this.selectedStatsYear = now.getFullYear();
    this.loadStats();
  }

  loadStats(): void {
    this._isLoading = true;
    this.resetBarChartData();
    this._budgetPlanService.getUserBudgetPlan(Kinvey.User.getActiveUser()._id)
    .then((plan: BudgetPlan) => {
      this.income = plan.netIncome;
      this.savingsGoal = plan.savingsGoal;
      this._expenseService.groupTransactionsByCategory(Kinvey.User.getActiveUser()._id, this.selectedStatsYear)
      .then((transactions: Array<Expense>) => {
        transactions.forEach(transaction => {
          this.barChartData[transaction.month].push(transaction.amount);
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

  goBack(): void {
    this.router.back();
  }

  resetBarChartData(): void {
    this.barChartData = {
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
}
