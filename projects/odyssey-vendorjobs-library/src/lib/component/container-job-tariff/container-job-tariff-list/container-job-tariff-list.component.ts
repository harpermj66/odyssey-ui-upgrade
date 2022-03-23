import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {DiscardingRequestQueue} from "../../../../../../odyssey-service-library/src/lib/utils/discarding-request-queue";
import {CurrentUserService} from "../../../../../../odyssey-service-library/src/lib/authentication/current-user.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'lib-container-job-tariff-list',
  templateUrl: './container-job-tariff-list.component.html',
  styleUrls: ['./container-job-tariff-list.component.scss'],
  providers: [
    DiscardingRequestQueue
  ]
})
export class ContainerJobTariffListComponent implements OnInit, OnDestroy, OnChanges {

  @Input() disabled: boolean;
  _readonly: boolean;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: CurrentUserService) {
  }

  get readonly(): boolean {
    return this._readonly
      || this.route.snapshot.queryParams.mode === 'view'
      || !(this.userService.user?.roles.VENDOR_JOB_APPROVER || this.userService.user?.roles.VENDOR_JOB_EDITOR);
  }

  @Input() set readonly(ro: boolean) {
    this._readonly = ro;
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
  }

  get tab(): string {
    // This is route of this list page only
    const routeSnapshot = this.route.snapshot.url[0].path;

    // This contains the complete route url
    const state = this.router.routerState;
    const parts = state.snapshot.url.split('/');

    // Find this page in the url parts
    const listIndex = parts.indexOf(routeSnapshot);

    let tab = 'lump-sum';
    // Compare with the child page
    if(listIndex < (parts.length - 1) && parts[listIndex + 1] === 'labour-rate') {
      tab = 'labour-rate';
    }
    return tab;
  }

  onLumpSumClick(): void {
    this.router.navigate(['./lump-sum'], {relativeTo: this.route});
  }

  onLabourRateClick(): void {
    this.router.navigate(['./labour-rate'], {relativeTo: this.route});
  }
}
