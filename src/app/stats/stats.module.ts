import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUIChartModule } from "nativescript-ui-chart/angular";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { SharedModule } from "../shared/shared.module";
import { StatsComponent } from "./stats.component";
import { StatsRoutingModule } from "./stats-routing.module";
import { ExpenseService } from "../expense/shared/expense.service";
import { CategoryService } from "../categories/shared/category.service";
import { GeneralStatsComponent } from "./general-stats/general-stats.component";
import { CategoryStatsComponent } from "./category-stats/category-stats.component";
import { BudgetPlanService } from "../budgetplan/shared/budgetplan.service";
import { SavingStatsComponent } from "./saving-stats/saving-stats.component";

@NgModule({
  imports: [
    StatsRoutingModule,
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    NativeScriptUIChartModule,

    SharedModule
  ],
  declarations: [
    StatsComponent,
    GeneralStatsComponent,
    CategoryStatsComponent,
    SavingStatsComponent
  ],
  providers: [
    ExpenseService,
    CategoryService,
    BudgetPlanService
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class StatsModule { }
