import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { ReportListComponent } from "./report-list.component";

const routes: Routes = [
  { path: "", component: ReportListComponent },
  // { path: "monthly-report", component: BillListComponent },
  // { path: "general-report", component: BillDetailEditComponent },
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class ReportRoutingModule { }
