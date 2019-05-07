import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { ReportRoutingModule } from "./report-routing.module";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { ReportListComponent } from "./report-list.component";

@NgModule({
  imports: [
    ReportRoutingModule,
    NativeScriptCommonModule
  ],
  declarations: [
    ReportListComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class ReportModule { }
