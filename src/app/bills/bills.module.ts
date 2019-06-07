import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { CategoryService } from "../categories/shared/category.service";
import { BillListComponent } from "./bill-list.component";
import { BillsRoutingModule } from "./bills-routing.module";
import { BillDetailEditComponent } from "./edit-bills/edit-bill.component";
import { BillEditService } from "./shared/bill-edit.service";
import { BillService } from "./shared/bill.service";
import { BillRecordService } from "./shared/billrecord.service";

import { DropDownModule } from "nativescript-drop-down/angular";
import { ExpenseService } from "../expense/shared/expense.service";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    BillsRoutingModule,
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    DropDownModule,

    SharedModule
  ],
  declarations: [
    BillListComponent,
    BillDetailEditComponent
  ],
  providers: [
    BillService,
    BillEditService,
    BillRecordService,
    CategoryService,
    ExpenseService
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class BillsModule { }
