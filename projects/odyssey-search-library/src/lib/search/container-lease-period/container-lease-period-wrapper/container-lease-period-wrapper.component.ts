import {Component} from '@angular/core';
import {
    UserSavedSearchRemoteService
} from "../../../../../../odyssey-service-library/src/lib/search/rule/service/user-saved-search-remote.service";
import {SearchServiceRemote} from "../../search-service.remote";
import {
    SavedSearchHistoryService
} from "../../../../../../odyssey-service-library/src/lib/search/rule/history/service/saved-search-history.service";

@Component({
             selector: 'lib-container-lease-period-wrapper',
             templateUrl: './container-lease-period-wrapper.component.html',
             styleUrls: ['./container-lease-period-wrapper.component.css'],
             providers: [UserSavedSearchRemoteService, SearchServiceRemote, SavedSearchHistoryService]
           })
export class ContainerLeasePeriodWrapperComponent {
}
