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
  selector: 'lib-cedex-repair-select',
  templateUrl: './cedex-repair-select.component.html',
  styleUrls: ['./cedex-repair-select.component.scss']
})
export class CedexRepairSelectComponent implements OnInit, OnChanges {

  type = "";
  @Input() location: string;
  @Input() label: string;
  @Input() placeholder: string;
  @Input() required: boolean;
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() contType?: ContTypeVoModel;

  @Input() value?: string | null = null;
  @Output() valueChange: EventEmitter<string | null> = new EventEmitter<string | null>();

  constructor() {
    this.updateType();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.contType) {
      this.updateType();
    }
  }

  updateType(): void {
    if(this.contType && this.contType.reefer) {
        this.type = CedexCodeModel.TYPE_REPAIR_REEFER;
    } else {
      this.type = CedexCodeModel.TYPE_REPAIR;
    }
  }

  onValueChange(newValue: string | null): void {
    if(this.value !== newValue) {
      this.value = newValue;
      this.valueChange.emit(this.value);
    }
  }
}
