import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular";

@Component({
  selector: "stats-list",
  moduleId: module.id,
  templateUrl: "./stats.component.html",
  styleUrls: ["./stats.component.scss"]
})
export class StatsComponent implements OnInit {

  constructor(
    private router: RouterExtensions
  ) {
  }

  ngOnInit(): void {
    // Content Here
  }

  goToStats (route: string): void {
    this.router.navigate([route], {
      transition: {
        name: "fade"
      }
    });
  }
}
