import { Component, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import {
  durationsList,
  storageOptionsList,
} from 'src/app/constants/durationsAndstorageOptionsList';
import { subscriptionPlansList } from 'src/app/constants/subscriptionPlansTypeList';
import { Subscription } from 'src/app/modeles/subscription';

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

  editable: boolean = true;

  submitted = false;

  submittedStipe1 = false;

  submittedStipe2 = false;

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
      initialPayment: [false],
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

  get f1(): { [key: string]: AbstractControl } {
    return this.paymentForm.controls;
  }

  get f2(): { [key: string]: AbstractControl } {
    return this.validationForm.controls;
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

  nextStipper(nbStep: number) {
    this.updatePrice();
    switch (nbStep) {
      case 1:
        this.submittedStipe1 = true;
        if (this.paymentForm.invalid) {
          return;
        }
        break;
      case 2:
        this.submittedStipe2 = true;
        if (this.validationForm.invalid) {
          return;
        }
        this.confirmSubscription();
        break;
    }

    this.stepper.next();
  }

  confirmSubscription(): void {
    const valuesSubscription: Subscription = {
      duration: parseInt(this.subscriptionForm.get('duration')?.value),
      storage: parseInt(this.subscriptionForm.get('storage')?.value),
      initialPayment: this.subscriptionForm.get('initialPayment')?.value,

      creditCardNumber: this.paymentForm.get('creditCardNumber')?.value,
      expirationDate: this.subscriptionForm.get('expirationDate')?.value,
      securityCode: this.subscriptionForm.get('securityCode')?.value,
      email: this.validationForm.get('email')?.value,
    };
    console.log('valuesSubscription', valuesSubscription);
  }

  checkFormInNavigation(): boolean {
    return this.paymentForm.invalid ? true : false;
  }
}
