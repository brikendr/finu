import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import { ExpenseComponent } from "./expense.component";
import { ExpenseOverview } from "./overview/expense-overview.component";

const routes: Routes = [
  { path: "", component: ExpenseComponent },
  { path: "expense-overview", component: ExpenseOverview },
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class ExpenseRoutingModule { }
