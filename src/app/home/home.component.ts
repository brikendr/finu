import { Component, OnInit } from "@angular/core";

import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular/router";
import { Kinvey } from "kinvey-nativescript-sdk";
import { ListViewEventData } from "nativescript-ui-listview";

class NavigatableElement {
  constructor(
    public name: string,
    public path: string,
    public icon: string) { }
}

let elements = [
  {
    name: "categories",
    path: "/home/categories",
    icon: String.fromCharCode(parseInt('f061', 16))
  }, {
    name: "expense",
    path: "home/newexpense",
    icon: String.fromCharCode(parseInt('f061', 16))
  }, {
    name: "currencies",
    path: "home/currencies",
    icon: String.fromCharCode(parseInt('f061', 16))
  }
];

@Component({
  selector: "Home",
  moduleId: module.id,
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  private _navigatable: Array<NavigatableElement>;

  constructor(
    private _routerExtensions: RouterExtensions,
    private page: Page
  ) {
    // this.page.actionBarHidden = true;
    this.page.backgroundSpanUnderStatusBar = true;
    this.page.className = "homepage-container";
    // this.page.statusBarStyle = "dark";

    this._navigatable = [];
    elements.forEach(item => {
      this._navigatable.push(new NavigatableElement(item.name, item.path, item.icon));
    });
  }

  ngOnInit(): void {
    /* Implement on component init logic */
  }
  
  get navigatable(): Array<NavigatableElement> {
    return this._navigatable;
  }

  onNavigatableTap(args: ListViewEventData): void {
    const tappedItem = args.view.bindingContext;
    this._routerExtensions.navigate([tappedItem.path], {
      animated: true,
      transition: {
        name: "slideRight",
        duration: 200,
        curve: "ease"
      }
    })
    .catch(() => {
      return alert({
        title: "Route Failure",
        okButtonText: "OK",
        message: `Route ${tappedItem.path} is not defined yet!`
      });
    });
  }

  logout(): void {
    Kinvey.User.logout()
      .then(() => {
        this._routerExtensions.navigate(["login"],
          {
            clearHistory: true,
            animated: true,
            transition: {
              name: "slideBottom",
              duration: 350,
              curve: "ease"
            }
          });
      });
  }
}
