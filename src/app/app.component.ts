import { Component, OnInit } from "@angular/core";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";

import { Kinvey } from "kinvey-nativescript-sdk";

import { Router, NavigationEnd } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";

import * as app from "application";
import { filter } from "rxjs/operators";

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit  {
  isUserLogged: boolean = false;
  private _activatedUrl: string;
  private _sideDrawerTransition: DrawerTransitionBase;

  constructor(
    private router: Router,
    private _routerExtensions: RouterExtensions
  ) { }

  ngOnInit(): void {
    this.isUserLogged = Kinvey.User.getActiveUser() !== null
    this._activatedUrl = "/home";
    this._sideDrawerTransition = new SlideInOnTopTransition();

    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => this._activatedUrl = event.urlAfterRedirects);
  }

  get sideDrawerTransition(): DrawerTransitionBase {
    return this._sideDrawerTransition;
  }

  isComponentSelected(url: string): boolean {
    return this._activatedUrl === url;
  }

  onNavItemTap(navItemRoute: string): void {
    this._routerExtensions.navigate([navItemRoute], {
      transition: {
        name: "fade"
      },
      clearHistory: true
    });

    this.hideSideDrawer();
  }

  hideSideDrawer() {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }

  get email(): string {
    return Kinvey.User.getActiveUser().email;
  }

  logout(): void {
    this.hideSideDrawer();
    this.isUserLogged = false;
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
