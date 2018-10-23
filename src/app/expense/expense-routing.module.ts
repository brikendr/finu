import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { Routes } from "@angular/router";
import { ExpenseComponent } from "./expense.component";
import { ExpenseOverviewComponent } from "./overview/expense-overview.component";

const routes: Routes = [
  { path: "", component: ExpenseComponent },
  { path: "expense-overview", component: ExpenseOverviewComponent }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class ExpenseRoutingModule { }
