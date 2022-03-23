import {Component, OnInit} from '@angular/core';
import {SidebarMenuModel, SubMenu} from "../../../../odyssey-shared-views/src/lib/sidebar-menus/sidebar-menu.model";
import {ActivatedRoute, Router} from "@angular/router";
import {
    SubheaderToolbarService
} from "../../../../odyssey-shared-views/src/lib/subheader-toolbar/subheader-toolbar.service";

@Component({
    selector: 'lib-crm-authenticated-pages',
    templateUrl: './crm-authenticated-pages.component.html',
    styleUrls: ['./crm-authenticated-pages.component.scss']
})
export class CrmAuthenticatedPagesComponent implements OnInit {

    leftSideBarState = 'maximized';
    showFiller = false;

    sideBarWideMenu: SidebarMenuModel[];

    constructor(private route: ActivatedRoute, private router: Router,
                private subHeaderToolbarService: SubheaderToolbarService) {
    }

    ngOnInit(): void {
        this.loadMenus();
    }

    loadMenus(): void {
        const menu: SidebarMenuModel[] = [];
        const utilityMenu = {
            groupTitle: "Utilities",
            groupIcon: "",
            restrictions: [],
            menus: [
                {title: 'Route finder', abbr: '', route: '', menus: []},
                {title: 'Container Tracking', abbr: '', route: '', menus: []}
            ]
        };
        menu.push(utilityMenu);
        this.sideBarWideMenu = menu;
    }

    onMenuChanged(menuItem: SubMenu): void {
        switch (menuItem.title) {
            case 'Route Finder':
                this.router.navigate(['/welcome/route-finder']);
                this.subHeaderToolbarService.module = 'Route finder';
                break;
            case 'Container Tracking':
                this.router.navigate(['/welcome/container-tracking']);
                this.subHeaderToolbarService.module = 'Route finder';
                break;
        }
    }

    onHome(): void {
    }

    onDrawerClose(): void {

    }

    onSignOut(): void {
        this.router.navigate(['/cover-page']);
    }
}
