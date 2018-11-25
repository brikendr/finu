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
import { Feedback } from "nativescript-feedback";

@Component({
  moduleId: module.id,
  selector: "BillDetailEdit",
  templateUrl: "./edit-bill.compoment.html",
  styleUrls: ["./edit-bill.component.scss"]
})
export class BillDetailEditComponent implements OnInit {
  buttonText: string = "Save";
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
  private feedback: Feedback;

  constructor(
    private _billEditService: BillEditService,
    private _billSerivce: BillService,
    private _pageRoute: PageRoute,
    private _routerExtensions: RouterExtensions,
    private _categoryService: CategoryService
  ) {
    this.feedback = new Feedback();
  }

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
        this.feedback.success({
          title: "Success!",
          message: `New monthly bill for ${this._bill.name} has been added!`
        });
        const t = setTimeout(() => {
          clearTimeout(t);
          this.navigateToBillList();
        }, 2000);
      }).catch((error) => {
        this.feedback.error({
          title: "Uh-oh!",
          message: `Unable to add monthly bill for ${this._bill.name}!`
        });
        this._isProcessing = false;
      });
    } else {
      opts._id = this._bill.id;
      opts.categoryId = this._categories.getValue(this.selectedIndex);
      opts.amount = parseInt(opts.amount, 10);
      delete opts.colorClass;
      delete opts.id;

      this._billSerivce.update(opts)
        .then(() => {
          this.feedback.success({
            title: "Update Completed!"
          });
          const t = setTimeout(() => {
            clearTimeout(t);
            this.navigateToBillList();
          }, 2000);
        })
        .catch((errorMessage: any) => {
          this.feedback.error({
            title: "Uh-oh!",
            message: `Unable to edit data for ${opts.name}!`
          });
          this._isProcessing = false;
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
