import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { MiscRoutingModule } from "./misc-routing.module";
import { MiscComponent } from "./misc.component";

@NgModule({
  imports: [
    MiscRoutingModule,
    NativeScriptCommonModule
  ],
  declarations: [
    MiscComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class MiscModule { }
