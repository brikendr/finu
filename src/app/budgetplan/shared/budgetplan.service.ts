import { BudgetPlan } from "./budgetplan.model";

import { Injectable } from "@angular/core";
import { Kinvey } from "kinvey-nativescript-sdk";

@Injectable()
export class BudgetPlanService {
  private budgetPlanStore = Kinvey.DataStore.collection("plan", Kinvey.DataStoreType.Cache);

  getUserBudgetPlan(userId: string): Promise<BudgetPlan> {
    const query = new Kinvey.Query();
    query.equalTo("userId", userId);

    return new Promise((resolve, reject) => {
      let budgetPlan;
      this.budgetPlanStore.find(query)
        .subscribe((data: any) => {
          if (data.length > 0) {
            const opts = data[0];
            opts.id = data._id;
            budgetPlan = new BudgetPlan(opts);
            resolve(budgetPlan);
          } else {
            reject("No registered budget plan for this user!");
          }
        }, (error: Kinvey.BaseError) => {
          reject("Unable to fetch users' budget plan!");
        });
    });
  }

  saveBudgetPlan(): Promise<BudgetPlan> {
    throw new Error("Not implemented");
  }

  editBudgetPlan(): Promise<BudgetPlan> {
    throw new Error("Not implemented");
  }
}
