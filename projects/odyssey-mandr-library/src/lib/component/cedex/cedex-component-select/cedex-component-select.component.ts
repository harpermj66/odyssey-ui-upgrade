import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {CedexCodeModel} from "../../../../../../odyssey-service-library/src/lib/mandr/cedex/model/cedex-code.model";
import {ContTypeVoModel} from "../../../../../../odyssey-service-library/src/lib/mandr/container/model/cont-type-vo.model";

@Component({
  selector: 'lib-cedex-component-select',
  templateUrl: './cedex-component-select.component.html',
  styleUrls: ['./cedex-component-select.component.scss']
})
export class CedexComponentSelectComponent implements OnInit, OnChanges {

  type = "";
  subtype?: string | null;
  @Input() location?: string | null;
  @Input() label: string;
  @Input() placeholder: string;
  @Input() required: boolean;
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() contType?: ContTypeVoModel;
  @Input() machinery: boolean;

  @Input() value?: string | null = null;
  @Output() valueChange: EventEmitter<string | null> = new EventEmitter<string | null>();

  constructor() {
    this.updateType();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.contType || changes.machinery || changes.location) {
      this.updateType();
    }
  }

  updateType(): void {
    delete this.subtype;
    if(this.contType && this.contType.reefer && this.machinery) {
        this.subtype = this.location;
    }
    this.type = CedexCodeModel.getComponentCodeType(this.contType, this.machinery);
  }

  onValueChange(newValue: string | null): void {
    if(this.value !== newValue) {
      this.value = newValue;
      this.valueChange.emit(this.value);
    }
  }
}
