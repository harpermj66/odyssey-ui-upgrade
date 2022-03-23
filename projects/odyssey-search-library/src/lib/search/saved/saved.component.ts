import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SavedSearchModel} from "../../../../../odyssey-service-library/src/lib/search/rule/model/saved-search.model";
import {UserSavedSearchRemoteService} from "../../../../../odyssey-service-library/src/lib/search/rule/service/user-saved-search-remote.service";
import {Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {FilterItem} from "../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import {SearchRuleEditorComponent} from "../rule/editor/search-rule-editor/search-rule-editor.component";

@Component({
  selector: 'lib-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.css']
})
export class SavedComponent implements OnInit, OnDestroy {
  @Input() filterItems: FilterItem[] = [];
  @Input() disabled: boolean;
  @Input() readonly: boolean;

  datasource: MatTableDataSource<SavedSearchModel> = new MatTableDataSource<SavedSearchModel>();
  displayedColumns = ['name', 'type','created', 'updated'];

  pageSettings = {
    total: 0,
    perPage: 10,
    page: 0,
  };

  loading = false;
  queued = false;

  private subscriptions: Subscription[] = [];

  constructor(private savedSearchService: UserSavedSearchRemoteService,
              public dialog: MatDialog) {
    this.subscriptions.push(
      this.savedSearchService.changed.subscribe(() => {
        this.refresh();
      })
    );
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      if(sub) {
        sub.unsubscribe();
      }
    });
  }

  refresh(): void {
    if(!this.loading) {
      this.loadData();
    } else {
      this.queued = true;
    }
  }

  private loadData(): void {
    this.loading = true;
    this.queued = false;

    this.savedSearchService.loadPage(this.pageSettings.page, this.pageSettings.perPage)
      .subscribe(
        page => {
          if(page.content) {
            this.datasource.data = page.content;
          } else {
            this.datasource.data = [];
          }
          this.pageSettings.total = page.totalElements;
        },
          error => {
        },
        () => {
          this.loading = false;
          if(this.queued) {
            this.loadData();
          }
        }
      );
  }

  onPagingChanged(event: PageEvent): void {
    this.pageSettings.perPage = event.pageSize;
    this.pageSettings.page = event.pageIndex;
    this.refresh();
  }

  trackById(index: number, entity: SavedSearchModel): any {
    return entity.id ? entity.id : index;
  }

  openCreateDialog(): void {
    this.dialog.open(SearchRuleEditorComponent, {
      maxHeight: '80%',
      maxWidth: '80%',
      width: '80%',
      height: '80%',
      data: {
        rule: new SavedSearchModel(),
        filterItems: this.filterItems
      }
    });
  }
}
