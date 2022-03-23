import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-rate-enquiry',
  templateUrl: './rate-enquiry.component.html',
  styleUrls: ['./rate-enquiry.component.scss']
})
export class RateEnquiryComponent implements OnInit {

  @Output() actioned = new EventEmitter<string>()

  constructor() { }

  ngOnInit(): void {
  }

  onCancel() {
    this.actioned.emit('Cancelled');
  }

  onMakeEnquiry() {

  }

}
