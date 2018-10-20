export class Expense {
  id: string;
  userId: string;
  dateTime: string;
  amount: number;
  isWithdraw: boolean;
  categoryId: string;

  constructor(options: any) {
    this.id = options.id;
    this.userId = options.userId;
    this.dateTime = options.dateTime;
    this.amount = options.amount;
    this.isWithdraw = options.isWithdraw;
    this.categoryId = options.categoryId;
  }
}
