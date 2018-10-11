import { Component, OnInit } from "@angular/core";

import { Page } from "tns-core-modules/ui/page";

@Component({
  selector: "Home",
  moduleId: module.id,
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  constructor(
    private page: Page
  ) {
    this.page.actionBarHidden = true;
    this.page.backgroundSpanUnderStatusBar = true;
    this.page.className = "homepage-container";
    // this.page.statusBarStyle = "dark";
  }

  ngOnInit(): void {
    /* Implement on component init logic */
  }
}
