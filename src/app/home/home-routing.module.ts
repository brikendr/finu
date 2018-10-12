import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { HomeComponent } from "~/app/home/home.component";
import { CategoryListComponent } from "~/app/categories/category-list.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "categories", component: CategoryListComponent },
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class HomeRoutingModule { }
