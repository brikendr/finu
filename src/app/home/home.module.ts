import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { HomeRoutingModule } from "~/app/home/home-routing.module";
import { HomeComponent } from "~/app/home/home.component";
import { CategoryListComponent } from "~/app/categories/category-list.component";
import { CategoryService } from "~/app/categories/shared/category.service";

@NgModule({
  imports: [
    HomeRoutingModule,
    NativeScriptCommonModule
  ],
  declarations: [
    HomeComponent,
    CategoryListComponent
  ],
  providers: [ //TODO: Move category to its own module
    CategoryService
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class HomeModule { }
