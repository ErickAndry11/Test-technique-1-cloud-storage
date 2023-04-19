import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionComponent } from './page/subscription/subscription.component';

const routes: Routes = [
  { path: 'subsription', component: SubscriptionComponent },
  {
    path: '**',
    redirectTo: 'subsription',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
