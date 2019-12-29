import { NgModule } from '@angular/core';

import { BdeRoutingModule } from './bde-routing.module';
import { SharedModule } from '../shared/shared.module';
import { BdeComponent } from './containers/bde.component';
import { BdeAccountsListComponent } from './components/bde-accounts-list.component';
import { BdeDebitFormComponent } from './components/bde-debit-form.component';
import { BdeRechargeFormComponent } from './components/bde-recharge-form.component';
import { BdeAccountComponent } from './containers/bde-account.component';
import { BdeOperationListComponent } from './components/bde-operation-list.component';
import { BdeContributionFormComponent } from './components/bde-contribution-form.component';
import { BdeOperationHistoryComponent } from './components/bde-operation-history.component';
import { OperationFilterComponent } from './components/operation-filter.component';

@NgModule({
  declarations: [
    BdeComponent,
    BdeAccountsListComponent,
    BdeDebitFormComponent,
    BdeRechargeFormComponent,
    BdeAccountComponent,
    BdeOperationListComponent,
    BdeContributionFormComponent,
    BdeOperationHistoryComponent,
    OperationFilterComponent,
  ],
  imports: [SharedModule, BdeRoutingModule],
})
export class BdeModule {}
