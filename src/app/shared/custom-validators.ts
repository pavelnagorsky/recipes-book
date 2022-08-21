import { AbstractControl, FormControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
  static isUrl(control: AbstractControl): ValidationErrors | null {
    const urlPattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
    return (
      urlPattern.test(control.value) 
        ? null
        : { "notUrl": true }
    )
  }

  static required(control: AbstractControl): ValidationErrors | null {
    return (
      typeof control.value == 'string' && control.value.trim() == ""
      ||
      control.value == null
    ) 
      ? {"required": true} 
      : null;
  }
}