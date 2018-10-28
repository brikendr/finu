export class Expense {
  id: string;
  userId: string;
  dateTime: string;
  month: string;
  amount: number;
  isWithdraw: boolean;
  categoryId: string;
  comment: string;

  constructor(options: any) {
    this.id = options.id;
    this.userId = options.userId;
    this.dateTime = options.dateTime;
    this.month = options.month;
    this.amount = options.amount;
    this.isWithdraw = options.isWithdraw;
    this.categoryId = options.categoryId;
    this.comment = options.comment;
  }
}
