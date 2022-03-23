import {Component} from '@angular/core';
import {
    UserSavedSearchRemoteService
} from "../../../../../../odyssey-service-library/src/lib/search/rule/service/user-saved-search-remote.service";
import {SearchServiceRemote} from "../../search-service.remote";
import {
    SavedSearchHistoryService
} from "../../../../../../odyssey-service-library/src/lib/search/rule/history/service/saved-search-history.service";

@Component({
             selector: 'lib-container-stock-wrapper',
             templateUrl: './container-stock-wrapper.component.html',
             styleUrls: ['./container-stock-wrapper.component.css'],
             providers: [UserSavedSearchRemoteService, SearchServiceRemote, SavedSearchHistoryService]
           })
export class ContainerStockWrapperComponent {
}
