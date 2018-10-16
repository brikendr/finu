import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { CategoryListComponent } from "./category-list.component";
import { CategoryRoutingModule } from "./category-routing.module";

import { CategoryService } from "./shared/category.service";

@NgModule({
  imports: [
    CategoryRoutingModule,
    NativeScriptCommonModule
  ],
  declarations: [
    CategoryListComponent
  ],
  providers: [
    CategoryService
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class CategoryModule { }
