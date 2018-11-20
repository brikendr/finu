import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { BillListComponent } from "./bill-list.component";
import { BillDetailEditComponent } from "./edit-bills/edit-bill.component";

const routes: Routes = [
  { path: "", component: BillListComponent },
  { path: "list/:state", component: BillListComponent },
  { path: "bills-edit/:id", component: BillDetailEditComponent },
  { path: "new-bill", component: BillDetailEditComponent }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class BillsRoutingModule { }
