import { Injectable } from "@angular/core";

import { Kinvey } from "kinvey-nativescript-sdk";
import { UtilService } from "~/app/shared/utils.service";
import { BillRecord } from "./billrecord.model";

@Injectable()
export class BillRecordService {
  private userBillRecords: Array<BillRecord> = [];
  private billRecordStore = Kinvey.DataStore.collection("billrecord", Kinvey.DataStoreType.Cache);

  getUserMonthlyBillRecords(userId: string): Promise<Array<BillRecord>> {
    const query = new Kinvey.Query();
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime();
    query.equalTo("userId", userId)
    .and().greaterThanOrEqualTo("dateTime", String(firstDay))
    .and().lessThanOrEqualTo("dateTime", String(lastDay));

    return UtilService.isUserLoggedIn()
      .then(() => {
        const stream = this.billRecordStore.find(query);

        return stream.toPromise();
      }).then((data: any) => {
        this.userBillRecords = [];
        data.forEach((billRecordEntry: any) => {
          billRecordEntry.id = billRecordEntry._id;
          const billRecord = new BillRecord(billRecordEntry);
          this.userBillRecords.push(billRecord);
        });

        return this.userBillRecords;
      }).catch((e) => {
        return [];
      });
  }

  save(billRecord: BillRecord): Promise<BillRecord> {
    return UtilService.isUserLoggedIn()
      .then(() => this.billRecordStore.save({
        userId: billRecord.userId,
        billId: billRecord.billId,
        expenseId: billRecord.expenseId,
        dateTime: billRecord.dateTime
      }).then(() => {
        return billRecord;
      }).catch((error: Kinvey.BaseError) => {
        throw new Error(`Unable to save entry! Error: ${error}`);
      }));
  }
}
