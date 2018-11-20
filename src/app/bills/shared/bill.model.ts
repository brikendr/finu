export class Bill {
  id: string;
  name: string;
  amount: number;
  userId: string;
  deadlineDay: number;
  isAvtale: boolean;
  hasReminder: boolean;
  reminderId: string;
  categoryId: string;
  colorClass?: string;

  constructor(options: any) {
    this.id = options.id;
    this.name = options.name;
    this.amount = options.amount;
    this.userId = options.userId;
    this.deadlineDay = options.deadlineDay;
    this.isAvtale = options.isAvtale;
    this.hasReminder = options.hasReminder;
    this.reminderId = options.reminderId;
    this.categoryId = options.categoryId;
    this.colorClass = options.colorClass;
  }
}
