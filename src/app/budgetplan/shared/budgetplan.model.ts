export class BudgetPlan {
  id: string;
  userId: string;
  netIncome: number;
  savingsGoal: number;

  constructor(options: any) {
    this.id = options.id;
    this.userId = options.userId;
    this.netIncome = options.netIncome;
    this.savingsGoal = options.savingsGoal;
  }
}
