import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { BudgetPlanService } from "../budgetplan/shared/budgetplan.service";
import { ExpenseService } from "../expense/shared/expense.service";
import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";

import { BillService } from "../bills/shared/bill.service";
import { BillRecordService } from "../bills/shared/billrecord.service";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    HomeRoutingModule,
    NativeScriptCommonModule,



    SharedModule
  ],
  declarations: [
    HomeComponent
  ],
  providers: [
    BudgetPlanService,
    ExpenseService,
    BillService,
    BillRecordService
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class HomeModule { }
