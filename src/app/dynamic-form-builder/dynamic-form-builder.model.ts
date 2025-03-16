export enum ValidationType {
	Required = 'required',
	RequiredTrue = 'requiredTrue',
	MinLength = 'minLength',
	MaxLength = 'maxLength',
	Min = 'min',
	Max = 'max',
	Email = 'email',
	Pattern = 'pattern'
}

export interface Validation {
    type: ValidationType;
    value?: string | number | RegExp;
    message: string;
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

export interface OptionItem {
	label: string;
	value: any;
	checked?: boolean;
}

export interface FormField {
	name: string;
	type: FieldType;
	inputType?: any;
	label: string;
	placeholder?: string;
	required?: boolean;
	options?: OptionItem[];
	value?: any;
	visible: boolean;
	validations: Validation[];
	fields: FormField[];
}

export interface State {
	name: string;
	button: string;
	fields: FormField[];
}