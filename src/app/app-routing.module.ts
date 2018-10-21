import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { LoginComponent } from "~/app/login/login.component";

const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "home", loadChildren: "~/app/home/home.module#HomeModule" },
    { path: "cars", loadChildren: "~/app/cars/cars.module#CarsModule" },
    { path: "misc", loadChildren: "~/app/misc/misc.module#MiscModule" },
    { path: "categories", loadChildren: "~/app/categories/category.module#CategoryModule" },
    { path: "expense", loadChildren: "~/app/expense/expense.module#ExpenseModule" }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
