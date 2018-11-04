import { Component, OnInit } from "@angular/core";

import { switchMap } from "rxjs/operators";
import { alert } from "tns-core-modules/ui/dialogs";

import { BillEditService } from "../shared/bill-edit.service";
import { Bill } from "../shared/bill.model";
import { BillService } from "../shared/bill.service";

import { Kinvey } from "kinvey-nativescript-sdk";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";

@Component({
  moduleId: module.id,
  selector: "BillDetailEdit",
  templateUrl: "./edit-bill.compoment.html",
  styleUrls: ["./edit-bill.component.scss"]
})
export class BillDetailEditComponent implements OnInit {
  buttonText: string = "Edit Bill";

  private _bill: Bill;
  private _isUpdating: boolean = false;
  private isAdding: boolean = false;

  constructor(
    private _billEditService: BillEditService,
    private _billSerivce: BillService,
    private _pageRoute: PageRoute,
    private _routerExtensions: RouterExtensions
  ) {}

  ngOnInit(): void {
    this._isUpdating = true;

    this._pageRoute.activatedRoute
      .pipe(switchMap((activatedRoute) => activatedRoute.params))
      .forEach((params) => {
        const billId = params.id;

        if (billId) {
          this.isAdding = false;
          this._bill = this._billEditService.startEdit(billId);
          this._isUpdating = false;
        } else {
          this.buttonText = "New Bill";
          this._isUpdating = false;
          this._bill = new Bill({});
          this.isAdding = true;
        }
      });
  }

  get bill(): Bill {
    return this._bill;
  }

  get isUpdating(): boolean {
    return this._isUpdating;
  }

  submit() {
    this._isUpdating = true;
    const opts = JSON.parse(JSON.stringify(this._bill));

    if (this.isAdding) {
      this._bill.userId = Kinvey.User.getActiveUser()._id;
      this._billSerivce.save(this._bill).then((billEntry) => {
        this.navigateToBillList();
      }).catch((error) => {
        console.log(error);
        this._isUpdating = false;
        alert({ title: "Oops!", message: "Something went wrong adding the bill.", okButtonText: "Ok" });
      });
    } else {
      opts._id = this._bill.id;
      delete opts.colorClass;
      delete opts.id;

      this._billSerivce.update(opts)
        .then(() => {
          this.navigateToBillList();
        })
        .catch((errorMessage: any) => {
          console.log(errorMessage);
          this._isUpdating = false;
          alert({ title: "Oops!", message: "Something went wrong. Please try again.", okButtonText: "Ok" });
        });
    }
  }

  navigateToBillList() {
    this._isUpdating = false;
    this._routerExtensions.navigate(["/bills"], {
      clearHistory: true,
      animated: true,
      transition: {
        name: "slideBottom",
        duration: 200,
        curve: "ease"
      }
    });
  }
}
