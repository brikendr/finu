import { Component, OnInit } from "@angular/core";

import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular/router";
import { Kinvey } from "kinvey-nativescript-sdk";
import { ListViewEventData } from "nativescript-ui-listview";

import { registerElement } from 'nativescript-angular/element-registry';
import { CardView } from 'nativescript-cardview';
registerElement('CardView', () => CardView);

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
  balanceProgressBar: string;
  balanceSpent: string;
  balanceLeft: string;

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
    this.calculateBalance();
    // this.calculateBudget();
  }

  calculateBalance() {
    let percent = 0;
    let progress = 50;
    let intervalId = setInterval(() => {
      this.animateBalanceProgressBar(percent);
      percent++;
      if (percent > 30) {
        this.balanceSpent = "200 NOK";
      }
      if (percent >= progress) {
        this.balanceLeft = "300 NOK";
      }
      if (percent > progress) {
        clearInterval(intervalId);
      }
    }, 50);
  }

  animateBalanceProgressBar(percent) {
    this.balanceProgressBar = percent + "*," + (100 - percent) + "*";
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
