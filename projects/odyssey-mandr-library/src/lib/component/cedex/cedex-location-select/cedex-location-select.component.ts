import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CedexCodeModel} from "../../../../../../odyssey-service-library/src/lib/mandr/cedex/model/cedex-code.model";
import {ContTypeVoModel} from "../../../../../../odyssey-service-library/src/lib/mandr/container/model/cont-type-vo.model";

@Component({
  selector: 'lib-cedex-location-select',
  templateUrl: './cedex-location-select.component.html',
  styleUrls: ['./cedex-location-select.component.scss']
})
export class CedexLocationSelectComponent implements OnInit, OnChanges {

  private readonly MACHINERY_FLAG = 'M';

  charOne: string | null;
  charTwo: string | null;
  charThree: string | null;
  charFour: string | null;

  type = "";
  typeSecondChar = "";
  typeThirdChar = "";
  typeFourthChar = "";
  @Input() label: string;
  @Input() placeholder: string;
  @Input() required: boolean;
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() contType?: ContTypeVoModel;
  @Output() machineryChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() value?: string | null = null;
  @Output() valueChange: EventEmitter<string | null> = new EventEmitter<string | null>();

  constructor() {
    this.updateType();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.value) {
      this.setLocation(this.value);
    }

    if(changes.contType) {
      this.updateType();
    }
  }

  get machinery(): boolean {
    return this.charOne === this.MACHINERY_FLAG;
  }

  updateType(): void {
      this.type = CedexCodeModel.getLocation1CodeType(this.contType);
      this.typeSecondChar = CedexCodeModel.getLocation2CodeType(this.contType, this.machinery);
      this.typeThirdChar = CedexCodeModel.getLocation3CodeType(this.contType);
      this.typeFourthChar = CedexCodeModel.getLocation4CodeType(this.contType);
  }

  private setLocation(value?: string | null): void {
    this.charOne = null;
    this.charTwo = null;
    this.charThree = null;
    this.charFour = null;

    if(value && value.length > 0) {
      this.charOne = value.charAt(0);
      if(value.length > 1) {
        this.charTwo = value.charAt(1);
      }
      if(value.length > 2) {
        this.charThree = value.charAt(2);
      }
      if(value.length > 3) {
        this.charFour = value.charAt(3);
      }
    }
  }

  private getLocation(): string {
    let location = '';
    if(this.charOne) {
      location += this.charOne;

      if(this.charTwo) {
        location += this.charTwo;

        if(this.charThree) {
          location += this.charThree;

          if(this.charFour) {
            location += this.charFour;
          }
        }
      }
    }

    if(location !== this.value) {
      this.value = location;
      this.valueChange.emit(this.value);
    }

    return location;
  }

  onCharOneChange(charOne: string | null): void {
    this.charOne = charOne;

    if(this.machinery) {
      this.machineryChange.emit(true);
    } else {
      this.machineryChange.emit(false);
    }

    // Machinery change will affect the type for the second char.
    this.updateType();

    this.getLocation();
  }

  onCharTwoChange(charTwo: string | null): void {
    this.charTwo = charTwo;
    this.getLocation();
  }

  onCharThreeChange(charThree: string | null): void {
    this.charThree = charThree;
    this.getLocation();
  }

  onCharFourChange(charFour: string | null): void {
    this.charFour = charFour;
    this.getLocation();
  }
}
