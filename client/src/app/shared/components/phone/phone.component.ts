import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { Countries } from '@app/utils/countries';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneComponent),
      multi: true,
    },
  ],
})
export class PhoneComponent implements ControlValueAccessor {
  @ViewChild('phone_number') phone_number!: ElementRef;
  @Input() name: string;
  @Input() label: string;
  @Input() optional: boolean = false; // amount

  @Input() keydown: (event: KeyboardEvent) => void;
  @Input() paste: (event: ClipboardEvent) => void;
  value: any;

  countries = Countries;

  params = {
    dial_code: '+90',
    phone_number: '',
  };

  ngOnInit() {}

  private onChange = (value: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onCountryChange(value: any): void {
    this.params.dial_code = value;
    this.phone_number.nativeElement.value = '';
    this.phone_number.nativeElement.focus();
    this.onChange('');
  }
  onClose() {
    this.countries = Countries;
  }

  updateValue(event: Event): void {
    if (event['dial_code']) {
      this.phone_number.nativeElement.value = '';
      this.phone_number.nativeElement.focus();
    } else {
      const target = event.target as HTMLInputElement;
      this.value = target.value;
      this.onChange(`${this.params.dial_code}-${this.value}`);
    }
  }

  search(event: Event) {
    this.countries = Countries.filter((item) => {
      return [
        item['languages']['en'].toLowerCase().indexOf(event.target['value']) >
          -1,
        item['languages']['tr'].toLowerCase().indexOf(event.target['value']) >
          -1,
      ].some((x) => x);
    });
  }
  onSubmit() {}
}
