import { alert } from "tns-core-modules/ui/dialogs";
import { BillEditService } from "../shared/bill-edit.service";
import { Bill } from "../shared/bill.model";
import { BillService } from "../shared/bill.service";

import { Component, OnInit } from "@angular/core";
import { CategoryService } from "~/app/categories/shared/category.service";
import { Category } from "~/app/categories/shared/cetegory.model";

import { Kinvey } from "kinvey-nativescript-sdk";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { switchMap } from "rxjs/operators";

import { SelectedIndexChangedEventData, ValueList } from "nativescript-drop-down";

@Component({
  moduleId: module.id,
  selector: "BillDetailEdit",
  templateUrl: "./edit-bill.compoment.html",
  styleUrls: ["./edit-bill.component.scss"]
})
export class BillDetailEditComponent implements OnInit {
  buttonText: string = "Edit Bill";
  title: string = "New Bill";
  selectedIndex = 1;

  private _bill: Bill = new Bill({
    name: "",
    amount: 0,
    deadlineDay: "",
    isAvtale: false
  });
  private _isProcessing: boolean = false;
  private isAdding: boolean = false;
  private _categories: ValueList<string> = new ValueList<string>();

  constructor(
    private _billEditService: BillEditService,
    private _billSerivce: BillService,
    private _pageRoute: PageRoute,
    private _routerExtensions: RouterExtensions,
    private _categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this._isProcessing = true;
    this._categoryService.load()
    .then((categories: Array<Category>) => {
      categories.forEach((category) => {
        this._categories.push({
          value: category.id,
          display: category.name
        });
      });

      this._pageRoute.activatedRoute
        .pipe(switchMap((activatedRoute) => activatedRoute.params))
        .forEach((params) => {
          const billId = params.id;

          if (billId) {
            this.isAdding = false;
            this._bill = this._billEditService.startEdit(billId);
            this.title = `Bill: ${this._bill.name}`;
            let index = 0;
            this.categories.forEach((category) => {
              if (category.value === this._bill.categoryId) {
                this.selectedIndex = index;

                return;
              } else {
                index += 1;
              }
            });
            this._isProcessing = false;
          } else {
            this.buttonText = "New Bill";
            this.title = "Create New Bill";
            this.isAdding = true;
            this._isProcessing = false;
          }
        });
      })
      .catch((error) => {
        alert({ title: "Oops!", message: "Could not load categories.", okButtonText: "Ok" });
      });
  }

  get bill(): Bill {
    return this._bill;
  }

  get isProcessing(): boolean {
    return this._isProcessing;
  }

  get categories(): ValueList<string> {
    return this._categories;
  }

  onchange(args: SelectedIndexChangedEventData) {
    // Empty block
  }

  onopen() {
    // Empty block
  }

  onclose() {
    // Empty block
  }

  submit() {
    this._isProcessing = true;
    const opts = JSON.parse(JSON.stringify(this._bill));

    if (this.isAdding) {
      this._bill.userId = Kinvey.User.getActiveUser()._id;
      this._bill.categoryId = this._categories.getValue(this.selectedIndex);
      this._bill.amount = parseInt(String(this._bill.amount), 10);
      this._billSerivce.save(this._bill).then((billEntry) => {
        this.navigateToBillList();
      }).catch((error) => {
        console.log(error);
        this._isProcessing = false;
        alert({ title: "Oops!", message: "Something went wrong adding the bill.", okButtonText: "Ok" });
      });
    } else {
      opts._id = this._bill.id;
      opts.categoryId = this._categories.getValue(this.selectedIndex);
      opts.amount = parseInt(opts.amount, 10);
      delete opts.colorClass;
      delete opts.id;

      this._billSerivce.update(opts)
        .then(() => {
          this.navigateToBillList();
        })
        .catch((errorMessage: any) => {
          console.log(errorMessage);
          this._isProcessing = false;
          alert({ title: "Oops!", message: "Something went wrong. Please try again.", okButtonText: "Ok" });
        });
    }
  }

  navigateToBillList() {
    this._isProcessing = false;
    this._routerExtensions.navigate(["/bills"], {
      animated: true,
      skipLocationChange: true,
      transition: {
        name: "slideBottom",
        duration: 200,
        curve: "ease"
      }
    });
  }
}
