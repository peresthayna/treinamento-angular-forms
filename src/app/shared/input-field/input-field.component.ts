import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const INPUT_FIELD_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputFieldComponent),
  multi: true
}

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css'],
  providers: [INPUT_FIELD_VALUE_ACCESSOR]
})
export class InputFieldComponent implements ControlValueAccessor {

  @Input() classeCssFeedback;
  @Input() classeCss;
  @Input() id: string;
  @Input() label: string;
  @Input() type = 'text';
  @Input() control;
  @Input() isReadyOnly = false;

  private innerValue: any;

  get value(){
    return this.innerValue;
  }

  set value(v: any){
    if(v !== this.innerValue){
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  constructor() { }

  onChangeCallback: (_: any) => void = () => {};
  onTouchedCallback: (_: any) => void = () => {};

  writeValue(v: any): void {
    this.value = v;
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isReadyOnly = isDisabled;
  }


}
