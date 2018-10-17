import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
  selector: "Misc",
  moduleId: module.id,
  templateUrl: "./misc.component.html",
  styleUrls: ["./misc.component.scss"]
})
export class MiscComponent implements OnInit {
  data = [];
  constructor(
    private _routerExtensions: RouterExtensions
  ) {
  }

  ngOnInit(): void {
    this.data.push({ name: "Budget", path: "budgetConfig" , icon: String.fromCharCode(parseInt("f061", 16)) });
    this.data.push({ name: "Reminders", path: "reminderConfig" , icon: String.fromCharCode(parseInt("f061", 16)) });
    this.data.push({ name: "Categories", path: "categories" , icon: String.fromCharCode(parseInt("f061", 16)) });
    this.data.push({ name: "Monthly Bills", path: "bills" , icon: String.fromCharCode(parseInt("f061", 16)) });
    this.data.push({ name: "Avtale Giro", path: "avtaleGiro" , icon: String.fromCharCode(parseInt("f061", 16)) });
  }

  navigate(route: string) {
    this._routerExtensions.navigate([route], {
      animated: true,
      transition: {
        name: "slideLeft",
        duration: 200,
        curve: "ease"
      }
    });
  }
}
