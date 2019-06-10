import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { Routes } from "@angular/router";
import { StatsComponent } from "./stats.component";
import { GeneralStatsComponent } from "./general-stats/general-stats.component";
import { CategoryStatsComponent } from "./category-stats/category-stats.component";
import { SavingStatsComponent } from "./saving-stats/saving-stats.component";

const routes: Routes = [
  { path: "", component: StatsComponent },
  { path: "general-stats", component: GeneralStatsComponent },
  { path: "category-stats", component: CategoryStatsComponent },
  { path: "saving-stats", component: SavingStatsComponent }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class StatsRoutingModule { }
