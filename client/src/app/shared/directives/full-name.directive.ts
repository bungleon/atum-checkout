import { Directive, HostListener } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';

@Directive({
    selector: '[fullNameValidator]',
})

export class fullNameValidator {

    private regex: RegExp = new RegExp("^([a-zA-Z]{2,}\\s[a-zA-Z]{1,}'?-?[a-zA-Z]{1,}\\s?([a-zA-Z]{1,})?)");
    private errorMessages = {
        badRegex: 'Please enter your First Name and Last Name',
    };

    constructor(private control: NgControl) { }

    @HostListener('keyup')
    public onKeyUp(): void {
        this.validateFullName();
    }

    @HostListener('blur')
    public onBlur(): void {
        this.validateFullName();
    }

    private validateFullName(): void {
        const formControl: AbstractControl = this.control.control;
        let errorMessage: string = null;

        if (!this.regex.test(formControl.value)) {
            errorMessage = this.errorMessages.badRegex;
            formControl.setErrors({ fullName: errorMessage });
        } else {
            if (formControl.errors && formControl.errors.hasOwnProperty('fullName')) {
                delete formControl.errors['fullName'];
                formControl.updateValueAndValidity();
            }
        }



    }
}