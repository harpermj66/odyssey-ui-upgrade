import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {SidebarMenuModel, SubMenu} from "../../../../odyssey-shared-views/src/lib/sidebar-menus/sidebar-menu.model";
import {ThemeService} from "../../../../odyssey-service-library/src/lib/theme/theme.service";
import {ActivatedRoute, Router} from "@angular/router";
import {
  RightViewEvent,
  RightViewEventType, SlideOutRightViewSubscriberService
} from "../../../../odyssey-home/src/app/home/slide-out-right-view/slide-out-right-view-subscriber.service";
import {Subscription} from "rxjs";
import {MatDrawerMode, MatSidenav} from "@angular/material/sidenav";
import {BreakpointObserver} from "@angular/cdk/layout";
import {
    getDefaultSidebarMode,
    getSidebarMode,
    SidebarMode
} from "../../../../odyssey-shared-views/src/lib/model/sidebar-mode";
import {sidebarMenus} from "../menu-definition";

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSidenav) leftDrawer!: MatSidenav;

  menuNormal = true;
  expandedMenu = 'Dashboard';
  sideBarMenu: SidebarMenuModel[];
  menuVisible = true;
  rightViewSubscription: Subscription;

  rightViewOpened = false;
  rightViewEvent: RightViewEvent;

  matDrawerMode: MatDrawerMode = "side";
  readonly side = 'side';
  readonly over = 'over';
  sidebarMode: SidebarMode;

  initialising = false;

  constructor(
        public themeService: ThemeService,private route: ActivatedRoute, private router: Router,
        private observer: BreakpointObserver) { }

  ngOnInit(): void {
    this.sidebarMode = getDefaultSidebarMode();
    this.loadMenu();
    // this.router.navigate(['/cover-page/dashboard']);
  }

  ngAfterViewInit(): void {
    this.sideBarSetResponse();
  }

  loadMenu(): void {
    this.sideBarMenu = sidebarMenus;
  }

  onMenuChanged(menuItem: SubMenu): void {
      this.router.navigate(['/cover-page/'+ menuItem.route]);
      if (!this.menuNormal) {
        this.menuVisible = false;
        this.animatedResizeEvent();
      }
  }

  navigateToPage(menuModel: SidebarMenuModel): void {
    this.expandedMenu = menuModel.groupTitle;
    this.router.navigate(['/cover-page/'+ menuModel.groupRoute]);
    if (!this.menuNormal ) {
      this.menuVisible = false;
    }
    this.matDrawerMode = 'side';
    this.sidebarMode = getSidebarMode(this.side);
  }

  animatedResizeEvent(): void {
    setTimeout(() => {
      // Another event for once the animation is finished
      window.dispatchEvent(new Event('resize'));
    }, 0);
  }

  sideBarSetResponse(): void {
    // Change the type of menu to over if 800px or below
    // this.observer.observe(['(max-width: 1440px)']).subscribe((res) => {
    //   if (res.matches) {
    //     this.menuVisible = false;
    //     this.menuNormal = false;
    //   } else {
    //       this.leftDrawer.open();
    //       this.menuNormal = true;
    //       this.menuVisible = true;
    //       this.animatedResizeEvent();
    //   }
    // });
  }

  onMainMenuMouseOut(): void {
    if (!this.menuNormal ) {
      this.menuVisible = false;
    }
  }

  onCloseMainMenu(): void {
    this.menuVisible = false;
    this.animatedResizeEvent();
  }

  onSidebarMouseOver(): void {
    if (!this.menuNormal) {
      this.menuVisible = true;
    }
  }

  onShowMainMenu(): void {
    if (this.menuNormal) {
      this.menuVisible = true;
      this.animatedResizeEvent();
    }
  }

  closeSidebar(): void {
    this.leftDrawer.mode = this.side;
    this.matDrawerMode = this.side;
    this.sidebarMode = getSidebarMode(this.side);
    this.animatedResizeEvent();
  }

  openSidebar(): void {
    this.leftDrawer.mode = this.over;
    this.matDrawerMode = this.over;
    this.sidebarMode = getSidebarMode(this.over);
  }

  navigateToSignInPage(): void{
    this.router.navigate(["signIn"], {queryParams: { route: 'cover-page/dashboard', application: "customer-portal"}});
  }

  navigateToCoverPage(): void{
    this.router.navigate(["cover-page"]);
  }

  navigateToRegistrationPage(): void{
    this.router.navigate(["register"]);
  }

  navigateToProfilePage(): void{
    this.router.navigate(["cover-page/profile"]);
  }
}
