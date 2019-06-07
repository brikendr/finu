import { Component, Input, ViewContainerRef } from "@angular/core";
// import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/directives/dialogs';

// import { DetailModalComponent } from "./modal/detail-modal.component";
import { DataService } from "../data.service";
import { DateService } from "../date.service";

@Component({
  selector: "app-transactions-list",
  moduleId: module.id,
  templateUrl: "./transaction-list.component.html"
})
export class TransactionsListComponent {
  @Input() transactions = [];

  data: DataService;
  dateFormat: DateService;
  categoriesIcons: {};
  categoryNames: {}
  categoryKeys: {}

  constructor(
    // private modal: ModalDialogService,
    // private vcRef: ViewContainerRef,
  ) {
    this.data = new DataService()
    this.dateFormat = new DateService();
    this.categoriesIcons = this.data.getCategoriesIcons();
    this.categoryNames = this.data.getCategoryNames();
    this.categoryKeys = this.data.getCategoryKeys();
  }

  public templateSelector(item) {
    return item.itemType;
  }

  // public onItemTap(args: any) {
  //   const itemData = args.view.bindingContext

  //   const options: ModalDialogOptions = {
  //     viewContainerRef: this.vcRef,
  //     context: itemData,
  //     fullscreen: true
  //   };

  //   this.modal.showModal(DetailModalComponent, options)
  //     .then((result: string) => {
  //       // console.log(result);
  //     });
  // }

  public getHeaderText(value: Date) {
    return this.dateFormat.shortDate(value)
  }

  public mathAbs(value: number) {
    return Math.abs(value)
  }

  public getBadgeIcon(id: string) {
    return this.categoriesIcons[id];
  }

  public getCategoryName(id: string) {
    return this.categoryNames[id];
  }

  public getCategoryKey(id: string) {
    return this.categoryKeys[id];
  }
}

