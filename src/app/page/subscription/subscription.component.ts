import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import {
  durationsList,
  storageOptionsList,
} from 'src/app/constants/durationsAndstorageOptionsList';
import { subscriptionPlansList } from 'src/app/constants/subscriptionPlansTypeList';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent {
  @ViewChild('stepper') stepper!: MatStepper;

  durations: number[] = durationsList;
  storageOptions: number[] = storageOptionsList;

  subscriptionForm: FormGroup;
  paymentForm: FormGroup;
  validationForm: FormGroup;

  totalPrice: number = 0;
  pricePerGb: number = 0;

  selectedSubscription = {
    pricePerGb: 2,
    totalPrice: 10,
  };

  constructor(private fb: FormBuilder) {
    this.subscriptionForm = this.fb.group({
      duration: [12, Validators.required],
      storage: [5, Validators.required],
      initialPayment: [false, Validators.required],
    });

    this.paymentForm = this.fb.group({
      creditCardNumber: ['', Validators.required],
      expirationDate: ['', Validators.required],
      securityCode: ['', Validators.required],
    });

    this.validationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      agreement: [false, Validators.requiredTrue],
    });

    this.updatePrice();
  }

  updatePrice(): void {
    const duration = parseInt(this.subscriptionForm.get('duration')?.value);
    const amount = parseInt(this.subscriptionForm.get('storage')?.value);
    const initialPayment = this.subscriptionForm.get('initialPayment')?.value;
    const pricePerGb = subscriptionPlansList.find(
      (plan) => plan.durationMonths === duration
    )?.priceUsdPerGb;

    let totalPrice = duration * amount * Number(pricePerGb);
    if (initialPayment) {
      totalPrice *= 0.9;
    }
    this.selectedSubscription = {
      pricePerGb: Number(pricePerGb),
      totalPrice: totalPrice,
    };
  }

  nextStipper() {
    this.updatePrice();
    this.stepper.next();
  }

  confirmSubscription(): void {}
}
