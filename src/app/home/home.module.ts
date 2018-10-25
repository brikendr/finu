import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { BudgetPlanService } from "../budgetplan/shared/budgetplan.service";
import { ExpenseService } from "../expense/shared/expense.service";
import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";

@NgModule({
  imports: [
    HomeRoutingModule,
    NativeScriptCommonModule
  ],
  declarations: [
    HomeComponent
  ],
  providers: [
    BudgetPlanService,
    ExpenseService
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class HomeModule { }
