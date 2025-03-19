export interface Currency {
    name: string;
    code: string;
}

export interface PaymentMethod {
    name: string;
    code: string;
}

export interface AdditionalPaymentService {
    name: string;
    code: string;
}

export interface EntityType {
    name: string;
    code: string;
}

export interface InsuranceType {
    name: string;
    code: string;
}

export interface TravelReason {
    name: string;
    code: string;
}

export interface IdentificationType {
    name: string;
    code: string;
}

export enum Gender {
    Male = 'male',
    Female = 'female'
}

export interface Person {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    ssnNumber: string;
    idNumber: string;
    age?: number;
    gender?: Gender;
    dateOfBirth?: string;
    married?: boolean;
    children?: number;
}

export interface Company {
    id: string;
    companyName: string;
    vatNumber?: string;
    companyEmail?: string;
    companyPhoneNumber?: string;
    countryOfOperation?: string;
}

export const currenciesList: Currency[] = [
    {
        name: "BGN",
        code: "bgn"
    },
    {
        name: "EUR",
        code: "eur"
    },
    {
        name: "USD",
        code: "usd"
    }
];

export const paymentMethodOptions: PaymentMethod[] = [
    {
        name: "Credit Card",
        code: "credit"
    },
    {
        name: "Debit Card",
        code: "debit"
    },
    {
        name: "Cash",
        code: "cash"
    }
];

export const additionalPaymentOptions: AdditionalPaymentService[] = [
    {
        name: "Insurance",
        code: "insurance"
    },
    {
        name: "Extended Warranty",
        code: "extendedWarranty"
    },
    {
        name: "Gift Wrapping",
        code: "giftWrap"
    }
];

export const entityTypeOptions: EntityType[] = [
    {
        name: "Individual",
        code: "INDIVIDUAL"
    },
    {
        name: "Business",
        code: "BUSINESS"
    }
];

export const insuranceTypeOptions: InsuranceType[] = [
    {
        name: "Health Insurance",
        code: "health"
    },
    {
        name: "Accident Insurance",
        code: "accident"
    },
    {
        name: "Car Insurance",
        code: "car"
    },
    {
        name: "Travel Insurance",
        code: "travel"
    },
    {
        name: "Property Insurance",
        code: "property"
    }
];

export const travelReasonOptions: TravelReason[] = [
    {
        name: "Business",
        code: "business"
    },
    {
        name: "Sport",
        code: "sport"
    },
    {
        name: "Work",
        code: "work"
    },
    {
        name: "Tourism",
        code: "tourism"
    },
    {
        name: "Other",
        code: "other"
    }
];

export const identificationTypeOptions: IdentificationType[] = [
    {
        name: "Personal Id",
        code: "PERSONAL_ID"
    },
    {
        name: "Passport",
        code: "PASSPORT"
    }
];

export const currentUser: Person = {
    id: "23678",
    firstName: "Lara",
    lastName: "Tompson",
    phoneNumber: "+19786159222",
    email: "lara_tompson79@gmail.com",
    ssnNumber: "876-42-8723",
    idNumber: "9809116532",
    dateOfBirth: "09/11/98",
    married: false
};

export const currentCompany: Company = {
    id: "69023451",
    companyName: "Samle Company Name & Partners",
    companyEmail: "office_sample_cp43@gmail.com",
    countryOfOperation: "United States"
};