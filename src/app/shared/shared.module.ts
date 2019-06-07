import { NgModule } from '@angular/core';
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { TransactionsListComponent } from './components/transaction-list.component';
import { LoadingComponent } from './components/loading.component';

// import { DetailModalComponent } from "./components/modal/detail-modal.component";

@NgModule({
  imports: [NativeScriptCommonModule],
  declarations: [TransactionsListComponent, LoadingComponent /*DetailModalComponent*/],
  exports: [TransactionsListComponent, LoadingComponent, /*DetailModalComponent*/],
  // entryComponents: [DetailModalComponent],
})
export class SharedModule { }
