import { Injectable } from '@angular/core';
import { of, delay, Observable } from 'rxjs';
import { additionalPaymentOptions, AdditionalPaymentService, currenciesList, Currency, paymentMethodOptions, PaymentMethod, EntityType, entityTypeOptions, InsuranceType, insuranceTypeOptions, TravelReason, travelReasonOptions, IdentificationType, identificationTypeOptions, Person, currentUser, Company, currentCompany } from './data-api.model';

@Injectable({
  providedIn: 'root'
})
export class DataApiService {
  private apiLookupMap: Map<string, () => any[]>;
  public readonly personApiUrl = '/user/23678';
  public readonly companyApiUrl = '/company/69023451';

  constructor() {
    this.apiLookupMap = new Map([
      ['/currencies', () => this.getCurrencies()],
      ['/payment-method', () => this.getPaymentMethodOptions()],
      ['/additional-payment-options', () => this.getAdditionalPaymentOptions()],
      ['/entity-types', () => this.getEntityTypeOptions()],
      ['/insurance-types', () => this.getInsuranceTypeOptions()],
      ['/travel-ins-reasons', () => this.getTravelInsuranceReasonOptions()],
      ['/identification-types', () => this.getIdentificationTypeOptions()],
    ]);
  }

  public apiLookupCall(endpoint: string, params?: any): Observable<{data: any }> {
    return of({ data: this.getResponseByLookupEndpoint(endpoint) }).pipe(delay(500));
  }

  public getCurrentUser(endpoint: string) {
    return of({ data: currentUser }).pipe(delay(500));
  }

  public getCurrentCompany(endpoint: string) {
    return of({ data: currentCompany }).pipe(delay(500));
  }

  private getResponseByLookupEndpoint(endpoint: string) {
    const creator = this.apiLookupMap.get(endpoint);
    if(!creator) {
      throw new Error(`${endpoint} API not found!`);
    }
    return creator();
  }

  private getCurrencies(): Currency[] {
    return currenciesList;
  }

  private getPaymentMethodOptions(): PaymentMethod[] {
    return paymentMethodOptions;
  }

  private getAdditionalPaymentOptions(): AdditionalPaymentService[] {
    return additionalPaymentOptions;
  }

  private getEntityTypeOptions(): EntityType[] {
    return entityTypeOptions;
  }

  private getInsuranceTypeOptions(): InsuranceType[] {
    return insuranceTypeOptions;
  }

  private getTravelInsuranceReasonOptions(): TravelReason[] {
    return travelReasonOptions;
  }

  private getIdentificationTypeOptions(): IdentificationType[] {
    return identificationTypeOptions;
  }
}
