import { Component, OnInit } from "@angular/core";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";

import { Kinvey } from "kinvey-nativescript-sdk";

import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";

import * as app from "application";

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit  {
  isVisible: boolean = false;
  private _sideDrawerTransition: DrawerTransitionBase;

  constructor(
    private router: Router,
    private _routerExtensions: RouterExtensions
  ) {
    // Use the component constructor to inject services.
  }

  ngOnInit(): void {
    this._sideDrawerTransition = new SlideInOnTopTransition();
  }

  get sideDrawerTransition(): DrawerTransitionBase {
    return null;
  }

  navigateToScreen(route: string): void {
    this.hideSideDrawer();
    this._routerExtensions.navigate([route], {
      animated: true,
      transition: {
        name: "slideLeft",
        duration: 200,
        curve: "ease"
      }
    });
  }

  hideSideDrawer() {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }

  logout(): void {
    this.hideSideDrawer();
    Kinvey.User.logout()
      .then(() => {
        this._routerExtensions.navigate(["login"],
          {
            clearHistory: true,
            animated: true,
            transition: {
              name: "slideLeft",
              duration: 350,
              curve: "ease"
            }
          });
      });
  }
}
