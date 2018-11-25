import { Bill } from "./shared/bill.model";
import { BillService } from "./shared/bill.service";
import { BillRecord } from "./shared/billrecord.model";
import { BillRecordService } from "./shared/billrecord.service";

import { Component, OnInit } from "@angular/core";
import { Expense } from "../expense/shared/expense.model";
import { ExpenseService } from "../expense/shared/expense.service";

import { Kinvey } from "kinvey-nativescript-sdk";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { switchMap } from "rxjs/operators";
import { UtilService } from "../shared/utils.service";

import { Feedback } from "nativescript-feedback";

@Component({
  selector: "BillList",
  moduleId: module.id,
  templateUrl: "./bill-list.component.html",
  styleUrls: ["./bill-list.component.scss"]
})
export class BillListComponent implements OnInit {
  _pendingBillsView: boolean = false;
  private _isLoading: boolean = false;
  private _bills: Array<Bill> = [];
  private feedback: Feedback;

  constructor(
    private _billService: BillService,
    private _billRecordSerivce: BillRecordService,
    private _expenseService: ExpenseService,
    private _pageRoute: PageRoute,
    private _routerExtensions: RouterExtensions
  ) {
    this.feedback = new Feedback();
  }

  ngOnInit(): void {
    this._isLoading = true;

    this._pageRoute.activatedRoute
    .pipe(switchMap((activatedRoute) => activatedRoute.params))
    .forEach((params) => {
      if (params.state && params.state === "pendingBills") {
        this._pendingBillsView = true;
        this._billService.loadUserBills(Kinvey.User.getActiveUser()._id)
          .then((bills: Array<Bill>) => {
            this._bills = [];
            this._billRecordSerivce.getUserMonthlyBillRecords(Kinvey.User.getActiveUser()._id)
            .then((billRecords: Array<BillRecord>) => {
              bills.forEach((bill) => {
                const paidBill = billRecords.find((record) => record.billId === bill.id);
                if (paidBill === undefined && !bill.isAvtale) {
                  bill.colorClass = UtilService.generateRandomTileColor();
                  this._bills.push(bill);
                }
              });
              this._isLoading = false;
            }).catch(() => {
              this._isLoading = false;
            });
          }).catch(() => {
            this._isLoading = false;
          });
      } else {
        this._billService.loadUserBills(Kinvey.User.getActiveUser()._id)
          .then((bills: Array<Bill>) => {
            this._bills = [];
            bills.forEach((bill) => {
              bill.colorClass = UtilService.generateRandomTileColor();
              this._bills.push(bill);
            });
            this._isLoading = false;
          }).catch(() => {
            this._isLoading = false;
          });
      }
    });
  }

  get bills(): Array<Bill> {
    return this._bills;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get pendingBillsView(): boolean {
    return this._pendingBillsView;
  }

  getBillDeadlineText(bill: Bill): string {
    const dueDate = bill.deadlineDay;
    const today = new Date().getDate();
    const overdue = dueDate - today;

    if (overdue > 0) {
      return `Due in ${overdue} days`;
    } else if (overdue < 0) {
      return `!!!!!! Due ${Math.abs(overdue)} days ago !!!!!!`;
    }

    return "Due today";
  }

  editBill(billdId: string): void {
    if (this._pendingBillsView) { return; }

    this._routerExtensions.navigate(["/bills/bills-edit", billdId],
      {
        animated: true,
        transition: {
          name: "slide",
          duration: 200,
          curve: "ease"
        }
      });
  }

  newBillScreen() {
    this._routerExtensions.navigate(["/bills/new-bill"],
      {
        animated: true,
        transition: {
          name: "slide",
          duration: 200,
          curve: "ease"
        }
      });
  }

  payBill(bill: Bill): void {
    const dateTime = new Date().getTime();
    const expenseOpts = {
      userId: Kinvey.User.getActiveUser()._id,
      dateTime: dateTime.toString(),
      month: new Date().getMonth() + 1,
      amount: bill.amount,
      isWithdraw: true,
      comment: `Bill Expense for ${bill.name}`,
      categoryId: bill.categoryId
    };

    const newExpense = new Expense(expenseOpts);
    this._isLoading = true;
    this._expenseService.save(newExpense).then((entry) => {
      const billRecord = new BillRecord({
        userId: Kinvey.User.getActiveUser()._id,
        billId: bill.id,
        expenseId: entry.id,
        dateTime: dateTime.toString()
      });
      this._billRecordSerivce.save(billRecord).then((record) => {
        this.feedback.success({
          title: "Paid!",
          message: `Your bill for ${bill.name} has been added to the expense list!`
        });
        this._bills = this._bills.filter((billItem) => billItem.id !== billRecord.billId);
        this._isLoading = false;
      }).catch((error) => {
        this.feedback.error({
          title: "Uh-oh!",
          message: `Unable to create a bill record for the ${bill.name} bill!`
        });
        this._isLoading = false;
      });
    }).catch((error) => {
      this.feedback.error({
        title: "Uh-oh!",
        message: `Unable to add expense for the ${bill.name} bill!`
      });
      this._isLoading = false;
    });
  }
}
