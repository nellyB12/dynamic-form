export enum ValidationType {
	Required = "required",
	RequiredTrue = "requiredTrue",
	MinLength = "minLength",
	MaxLength = "maxLength",
	Min = "min",
	Max = "max",
	Email = "email",
	Pattern = "pattern",
	SsnCheck = "ssnCheck",
	Passport = "passport",
	Vat = "vat"
}

export interface ValidationCheck {
	field: string;
	value: any;
}

export interface Validation {
    type: ValidationType;
    value?: string | number | RegExp;
    message: string;
	when?: ValidationCheck;
}

export enum FieldType {
	Text = "text",
	Textarea = "textarea",
	Dropdown = "dropdown",
	Checkbox = "checkbox",
	Radio = "radio",
	TextCustomValidation = "textCustomValidation",
	Group = "group",
}

export enum Width {
	OneQuarter = 25,
	OneTrack = 33.33,
	OneHalf = 50,
	TwoThirds = 66.66,
	ThreeQuarters = 75,
	FullWidth = 100
}

export enum Breakpoint {
	Small = 576,
	Medium = 768,
	Large = 992,
	ExtraLarge = 1200,
	ExtraExtraLarge = 1400
}

export enum Gutter {
	Null = 0,
	One = 1,
	Two = 2,
	Three = 3,
	Four = 4,
	Five = 5
}

export interface OptionItem {
	label: string;
	value: any;
	checked?: boolean;
}

export interface VisibleCheck {
	field: string;
	value: any;
}

export interface FormField {
	name: string;
	type: FieldType;
	label: string;
	width?: Width;
	placeholder?: string;
	required?: boolean;
	lookupApi?: string;
	options?: OptionItem[];
	value?: any;
	visibleIf?: VisibleCheck;
	validations?: Validation[];
	fields?: FormField[];
}

export interface Layout {
	breakpoint?: Breakpoint;
	gutters?: {
		horizontal: Gutter,
		vertical: Gutter
	}
}

export interface State {
	name: string;
	submitLabel?: string;
	getDataApi?: [string];
	fields: FormField[];
	layout?: Layout;
}