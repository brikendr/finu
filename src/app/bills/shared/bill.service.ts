import { Injectable } from "@angular/core";
import { Bill } from "./bill.model";

import { Kinvey } from "kinvey-nativescript-sdk";
import { UtilService } from "~/app/shared/utils.service";

@Injectable()
export class BillService {
  private userBills: Array<Bill> = [];
  private billStore = Kinvey.DataStore.collection("bill", Kinvey.DataStoreType.Cache);

  loadUserBills(userId: string): Promise<Array<Bill>> {
    const query = new Kinvey.Query();
    query.equalTo("userId", userId);

    return UtilService.isUserLoggedIn()
      .then(() => {
        const stream = this.billStore.find(query);

        return stream.toPromise();
      }).then((data: any) => {
        this.userBills = [];
        data.forEach((billEntry: any) => {
          billEntry.id = billEntry._id;
          const bill = new Bill(billEntry);
          this.userBills.push(bill);
        });

        return this.userBills;
      }).catch((e) => {
        console.log(e);

        return [];
      });
  }

  getBillById(id: string): Bill {
    if (!id) {
      return;
    }

    return this.userBills.filter((bill) => {
      return bill.id === id;
    })[0];
  }

  update(opts: any): Promise<any> {
    return this.billStore.save(opts);
  }

  save(bill: Bill): Promise<Bill> {
    return UtilService.isUserLoggedIn()
      .then(() => this.billStore.save({
        name: bill.name,
        amount: bill.amount,
        userId: bill.userId,
        deadlineDay: bill.deadlineDay,
        isAvtale: bill.isAvtale,
        hasReminder: bill.hasReminder,
        reminderId: bill.reminderId
      }).then(() => {
        return bill;
      }).catch((error: Kinvey.BaseError) => {
        throw new Error("Unable to save entry!");
      }));
  }
}
