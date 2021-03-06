import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { ExpenseRoutingModule } from "./expense-routing.module";
import { ExpenseComponent } from "./expense.component";

import { DropDownModule } from "nativescript-drop-down/angular";
import { CategoryService } from "../categories/shared/category.service";
import { ExpenseService } from "./shared/expense.service";

import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { ExpenseDetailsComponent } from "./details/expense-details.component";
import { ExpenseOverviewComponent } from "./overview/expense-overview.component";

@NgModule({
  imports: [
    ExpenseRoutingModule,
    NativeScriptCommonModule,
    DropDownModule,
    NativeScriptFormsModule
  ],
  declarations: [
    ExpenseComponent,
    ExpenseOverviewComponent,
    ExpenseDetailsComponent
  ],
  providers: [
    CategoryService,
    ExpenseService
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class ExpenseModule { }
