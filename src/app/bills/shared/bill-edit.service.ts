import { Injectable } from "@angular/core";
import { Bill } from "./bill.model";
import { BillService } from "./bill.service";

@Injectable()
export class BillEditService {
  private _editModel: Bill;

  constructor(private _billService: BillService) { }

  startEdit(id: string): Bill {
    this._editModel = null;

    return this.getEditableBillById(id);
  }

  getEditableBillById(id: string): Bill {
    if (!this._editModel || this._editModel.id !== id) {
      const car = this._billService.getBillById(id);

      // get fresh editable copy of car model
      this._editModel = new Bill(car);
    }

    return this._editModel;
  }
}
