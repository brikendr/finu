import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { BillListComponent } from "./bill-list.component";
import { BillsRoutingModule } from "./bills-routing.module";
import { BillDetailEditComponent } from "./edit-bills/edit-bill.component";
import { BillEditService } from "./shared/bill-edit.service";
import { BillService } from "./shared/bill.service";

import { NativeScriptFormsModule } from "nativescript-angular/forms";

@NgModule({
  imports: [
    BillsRoutingModule,
    NativeScriptCommonModule,
    NativeScriptFormsModule
  ],
  declarations: [
    BillListComponent,
    BillDetailEditComponent
  ],
  providers: [
    BillService,
    BillEditService
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class BillsModule { }
