import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { HomeRoutingModule } from "~/app/home/home-routing.module";
import { HomeComponent } from "~/app/home/home.component";

@NgModule({
  imports: [
    HomeRoutingModule,
    NativeScriptCommonModule,
  ],
  declarations: [
    HomeComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class HomeModule { }
