import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { LoginComponent } from "~/app/login/login.component";
import { UserService } from "~/app/shared/user.service";

import { BottomNavigationComponent } from "./shared/components/bottom-navigation.component";
import { CardView } from "nativescript-cardview";

import { registerElement } from "nativescript-angular";
registerElement("NumericKeyboard", () => require("nativescript-numeric-keyboard").NumericKeyboardView);
registerElement("PullToRefresh", () => require("nativescript-pulltorefresh").PullToRefresh);
registerElement("CardView", () => CardView);

@NgModule({
    bootstrap: [
      AppComponent
    ],
    imports: [
      NativeScriptModule,
      NativeScriptFormsModule,
      NativeScriptHttpClientModule,
      AppRoutingModule,
      NativeScriptUISideDrawerModule
    ],
    declarations: [
      AppComponent,
      LoginComponent,
      BottomNavigationComponent
    ],
    schemas: [
      NO_ERRORS_SCHEMA
    ],
    providers: [
      UserService
    ]
})
export class AppModule { }
