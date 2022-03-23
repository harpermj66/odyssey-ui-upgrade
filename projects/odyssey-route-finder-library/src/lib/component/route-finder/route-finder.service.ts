import { Injectable } from '@angular/core';
import {ScheduleRemoteService} from "../../service/schedule-remote.service";
import {Port} from "../../model/port";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RouteFinderService {

  loadingPorts = true;

  loadPorts: Port[] = [];
  dischargePorts: Port[] = [];

  loadPort: Port;
  dispatchPort: Port;

  form: FormGroup;
  departingControl: FormControl;
  daysControl: FormControl;
  directionControl: FormControl;
  loadPortControl: FormControl;
  dischargePortControl: FormControl;

  loadPortOptions: Observable<Port[]>;
  dischargePortOptions: Observable<Port[]>;

  days = 14;

  routePreselected = false;

  constructor(private scheduleRemoteService: ScheduleRemoteService, public formBuilder: FormBuilder,) { }

  findPorts(portPin: string) {
    let parent = this;
    this.loadingPorts = true;
    this.scheduleRemoteService.findPorts(portPin).subscribe(
    (ports: any) => {
        parent.loadPorts = ports;
        parent.loadingPorts = false;
    }, (error: any) => {
        parent.loadingPorts = false;
    });
  }


  onLoadPortChanged(port: Port) {
    this.loadPort = port;
  }

  onDispatchPortChanged(port: Port) {
    this.dispatchPort = port;
  }

  prepareForm():void {

    // Individual control instantiation
    this.loadPortControl = new FormControl('', Validators.required);
    this.dischargePortControl = new FormControl('', Validators.required);
    this.departingControl = new FormControl(new Date(), Validators.required);
    this.daysControl = new FormControl(this.days, Validators.required);
    this.directionControl = new FormControl('departs', Validators.required);

    // And the form
    this.form = this.formBuilder.group({
        loadPort: this.loadPortControl,
        dischargePort: this.dischargePortControl,
        direction: this.directionControl,
        departing: this.departingControl,
        days: this.daysControl
    });

  }

  prepareFilters() {
    this.loadPortOptions = this.loadPortControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterLoadPort(value))
    );
    this.dischargePortOptions = this.dischargePortControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterLoadPort(value))
    );
  }

  private _filterLoadPort(value: string): Port[] {
    return this.loadPorts.filter(option => this.locatedValue(value, option));
  }

  private _filterDischargePort(value: string): Port[] {
    return this.dischargePorts.filter(option => this.locatedValue(value, option));
  }

  private locatedValue(filterValue: string, option: Port): boolean {
    const filter = filterValue.replace(' ', '').toLowerCase();
    const target = option.code.replace('', '').toLowerCase();
    return  target.indexOf(filter) >= 0;
  }
}
