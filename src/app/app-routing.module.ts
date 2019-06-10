import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { LoginComponent } from "~/app/login/login.component";

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "home", loadChildren: "~/app/home/home.module#HomeModule" },
  { path: "misc", loadChildren: "~/app/misc/misc.module#MiscModule" },
  { path: "categories", loadChildren: "~/app/categories/category.module#CategoryModule" },
  { path: "expense", loadChildren: "~/app/expense/expense.module#ExpenseModule" },
  { path: "bills", loadChildren: "~/app/bills/bills.module#BillsModule" },
  { path: "stats", loadChildren: "~/app/stats/stats.module#StatsModule" }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
