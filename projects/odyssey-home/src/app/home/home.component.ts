import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MenuEvent} from "../../../../odyssey-shared-views/src/lib/legacy-menu/legacy-menu.component";
import {DomSanitizer} from "@angular/platform-browser";
import {ThemeService} from "../../../../odyssey-service-library/src/lib/theme/theme.service";
import {
    SubheaderToolbarService
} from "../../../../odyssey-shared-views/src/lib/subheader-toolbar/subheader-toolbar.service";
import {SidebarMenuModel, SubMenu} from "../../../../odyssey-shared-views/src/lib/sidebar-menus/sidebar-menu.model";
import {BreakpointObserver} from "@angular/cdk/layout";
import {MatSidenav} from "@angular/material/sidenav";
import {OdysseyLegacyService} from "../odyssey-legacy-page/odyssey-legacy-service";
import {
    RightViewEvent,
    RightViewEventType,
    SlideOutRightViewSubscriberService
} from "./slide-out-right-view/slide-out-right-view-subscriber.service";
import {Subscription} from "rxjs";
import {CompanyType} from "../../../../odyssey-service-library/src/lib/authentication/current-user.service";
import {getSidebarMode} from "../../../../odyssey-shared-views/src/lib/model/sidebar-mode";

const NON_LEGACY_MENUS: Set<string> =
  new Set<string>().add('Route Finder')
  .add('Saved Searches').add('Quotations').add('Service Contracts').add('SI')
  .add('Freight Invoices').add('C/Note').add('DA');

const NO_ROUTE = 'route-not-found';

@Component({
             selector: 'app-home',
             templateUrl: './home.component.html',
             styleUrls: ['./home.component.scss']
           })
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  public static readonly NO_ROUTE = NO_ROUTE;

  @ViewChild(MatSidenav) leftDrawer!: MatSidenav;

  expandedMenu = 'Dynamic Search';
  rightViewSubscription: Subscription;

  leftSideBarState = 'minimized';
  sideBarWideMenu: SidebarMenuModel[];
  leftNavWidth = 340;
  initialising = false;

  rightViewOpened = false;
  rightViewEvent: RightViewEvent;
  viewTitle = '';
  closedSidebarMode = getSidebarMode("side");

  @Output() menuChanged = new EventEmitter<MenuEvent>();

  constructor(private route: ActivatedRoute, private router: Router,
              public sanitizer: DomSanitizer,
              public themeService: ThemeService,
              public subHeaderToolbarService: SubheaderToolbarService,
              private observer: BreakpointObserver,
              public odysseyLegacyService: OdysseyLegacyService,
              public slideOutRightViewSubscriberService: SlideOutRightViewSubscriberService) { }


  ngOnInit(): void {
    this.loadMenu();
    this.subscribeToRightViewEvents();
  }

  ngAfterViewInit(): void {
    this.sideBarSetResponse();
  }


  ngOnDestroy(): void {
    if (this.rightViewSubscription != null) {
      this.rightViewSubscription.unsubscribe();
    }
  }

  get legacyView(): boolean {
    return this.odysseyLegacyService.legacyView;
  }

  set legacyView(val: boolean) {
    this.odysseyLegacyService.legacyView = val;
  }

  subscribeToRightViewEvents(): void {
    this.rightViewSubscription = this.slideOutRightViewSubscriberService.showRightViewSubscriber.subscribe((value: RightViewEvent) => {
      if (value.type === RightViewEventType.Open) {
        this.rightViewEvent = value;
        this.rightViewOpened = true;
        this.viewTitle = value.viewTitle;
      } else if (value.type === RightViewEventType.Close) {
        this.rightViewOpened = false;
      }
    });
  }

  onRightDrawerClose(): void {
    this.rightViewOpened = false;
    this.slideOutRightViewSubscriberService.showRightViewSubscriber.next(new RightViewEvent(RightViewEventType.Close, '', '', ''));
  }

  sideBarSetResponse(): void {

    this.initialising = true;
    // Change the type of menu to over if 800px or below
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.leftDrawer.mode = 'over';
        this.leftDrawer.close();
      } else {
        if (!this.initialising) {
          this.leftDrawer.mode = 'side';
          this.leftDrawer.open();
        }
      }
    });

    this.initialising = false;
  }

    loadMenu(): void  {
        const menu: SidebarMenuModel[] = [];
        const searchMenu = {groupTitle: "Dynamic Search",  groupIcon: "dynamic_form", groupRoute: '',
            menus: [
              {
                title: 'Quotations',
                abbr: '',
                route: 'search-quotes',
                menus: [],
                icon: '',
                restrictions: [{ roles: ['QUOTE_VIEWER', 'QUOTE_EDITOR', 'QUOTE_APPROVER'] }]
              },
              {
                title: 'Service Contracts', abbr: '', route: 'search-service-contracts', menus: [], icon: '',
                restrictions: [{ roles: ['SERVICE_CONTRACT_VIEWER', 'SERVICE_CONTRACT_EDITOR', 'SERVICE_CONTRACT_APPROVER'] }]
              },
              {
                title: 'Bookings', abbr: '', route: 'search-bookings', menus: [],
                restrictions: [{ roles: ['BOOKING_VIEWER', 'BOOKING_EDITOR', 'BOOKING_APPROVER'] }]
              },
              {
                title: 'Containers by Booking', abbr: '', route: 'search-container', menus: [], icon: '',
                restrictions: [{ roles: ['BOOKING_VIEWER'] }]
              },
              {
                title: 'Commodities by Booking', abbr: '', route: 'search-commodity', menus: [], icon: '',
                restrictions: [{ roles: ['BOOKING_VIEWER'] }]
              },
              {
                title: 'Shipping Instructions', abbr: '', route: 'search-shipping-instructions', menus: [], icon: '',
                restrictions: [{ roles: ['SHIPPING_INSTRUCTION_VIEWER', 'SHIPPING_INSTRUCTION_EDITOR', 'SHIPPING_INSTRUCTION_APPROVER'] }]
              },
              {
                title: 'Container Events', abbr: '', route: 'search-container-event', menus: [], icon: '',
                restrictions: [{roles: ['CONTAINER_ALLOCATOR']}]
              },
                {
                    title: 'Container Stock', abbr: '', route: 'search-container-stock', menus: [], icon: '',
                    restrictions: [{roles: ['CONTAINER_STOCK_VIEWER']}]
                },
                {title: 'Container Lease Period', abbr: '', route: 'search-container-lease-period', menus: [], icon: '',
                    restrictions: [{roles: ['CONTAINER_ALLOCATOR']}]
                },
                {
                title: 'Freight Invoices', abbr: '', route: 'search-freight-invoices', menus: [], icon: '',
                restrictions: [{ roles: ['FREIGHT_INVOICE_VIEWER', 'FREIGHT_INVOICE_EDITOR', 'FREIGHT_INVOICE_APPROVER'] }]
              },
              {
                title: 'Credit Notes', abbr: '', route: 'search-credit-notes', menus: [], icon: '',
                restrictions: [{ roles: ['FREIGHT_INVOICE_VIEWER', 'FREIGHT_INVOICE_EDITOR', 'FREIGHT_INVOICE_APPROVER'] }]
              },
              {
                title: 'Disbursement Accounts', abbr: '', route: 'search-disbursement-accounts', menus: [], icon: '',
                restrictions: [{ roles: ['DISBURSEMENT_ACCOUNT_EDITOR', 'DISBURSEMENT_ACCOUNT_APPROVER'] }]
              },
              {
                title: 'Repair Jobs',
                abbr: '',
                route: 'search-repair-jobs',
                menus: [],
                restrictions: [{ roles: ["MR_EDITOR", "MR_VIEWER", "MR_APPROVER"] }]
              }
            ]
        };
        menu.push(searchMenu);
        // tslint:disable:max-line-length
        const dashboardsMenu = {groupTitle: "Dashboards", groupIcon: "dashboard", restrictions: [{roles: ["DATA_VIEWER"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT], companyPreferences: ["fullAccess"]}], menus: [
                {title:'Capacity management',abbr:'mCapMan', route:NO_ROUTE, restrictions: [{carrierRoles: ["SCHEDULE_EDITOR","SCHEDULE_APPROVER"], companyTypesDenied: [CompanyType.SHIPPER]}], menus: []},
                {title: 'Voyage booking statistics', abbr:'mvoyBookSt', route:NO_ROUTE, menus: []}]};
        menu.push(dashboardsMenu);
        // tslint:disable-next-line:max-line-length
        const notificationsMenu = {groupTitle: "Notifications",  groupIcon: "announcement", menus: [
                {title:'My activity',abbr:'msocdisId', route:NO_ROUTE, menus: []},
                {title: 'Network directory', abbr:'msocNetDir', route:NO_ROUTE, menus: []}]};
        menu.push(notificationsMenu);
        const schedulesMenu = {
            groupTitle: "Schedules",  groupIcon: "directions_boat", restrictions: [{roles: ["SCHEDULE_VIEWER","SCHEDULE_EDITOR","SCHEDULE_APPROVER"]}], menus: [
                {title:'View live schedules',abbr:'msvlId', route:NO_ROUTE, menus: []},
                {title:'Route Finder',abbr:'msslId', route:'routefinder', menus: []},
                {title:'Upcoming Sailings',abbr:'msusail', route:NO_ROUTE, restrictions: [{companyTypesDenied: [CompanyType.SHIPPER]}], menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title:'Search Route',abbr:'mssDijkId', route:NO_ROUTE, restrictions: [{roles: ["DEVELOPER"], companyTypesAllowed: [CompanyType.CARRIER]}], menus: []},
                {title:'Port connections',abbr:'mssportConId', route:NO_ROUTE, restrictions: [{roles: ["ADMIN"], companyTypesAllowed: [CompanyType.CARRIER]}], menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title:'Search Transports',abbr:'mslvlId', route:NO_ROUTE, restrictions: [{roles: ["VESSEL_VIEWER"]}], menus: []},
                {title:'Create a Transport',abbr:'msmlId', route:NO_ROUTE, menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title:'Search Trade Routes',abbr:'mstllId', route:NO_ROUTE, restrictions: [{roles: ["SCHEDULE_EDITOR","SCHEDULE_APPROVER"], companyTypesAllowed: [CompanyType.CARRIER]}], menus: []},
                {title:'Create Trade Route',abbr:'msscId', route:NO_ROUTE, restrictions: [{roles: ["SCHEDULE_EDITOR","SCHEDULE_APPROVER"], companyTypesAllowed: [CompanyType.CARRIER]}], menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title:'Schedule Planner',abbr:'mspvoylId', route:NO_ROUTE, menus: []},
                {title:'Search Voyages',abbr:'mssvoylId', route:NO_ROUTE, menus: []},
                {title:'Create Voyages',abbr:'msvoylId', route:NO_ROUTE, menus: []},
                {title:'Create Multiple Voyages',abbr:'msavoylId', route:NO_ROUTE, menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title:'Search Port Operations Reports',abbr:'mSPortOpsId', route:NO_ROUTE, restrictions: [{carrierRoles: ["SCHEDULE_VIEWER","PORT_OPERATIONS_EDITOR","PORT_OPERATIONS_APPROVER"], companyTypesDenied: [CompanyType.SHIPPER]}], menus: []},
                {title:'Create Port Operation Report',abbr:'mMPortOpsId', route:NO_ROUTE, restrictions: [{carrierRoles: ["PORT_OPERATIONS_EDITOR","PORT_OPERATIONS_APPROVER"], companyTypesDenied: [CompanyType.SHIPPER]}], menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title:'Noon Reports',abbr:'mSNoonRepId', route:NO_ROUTE, restrictions: [{carrierRoles: ["SCHEDULE_VIEWER","PORT_OPERATIONS_EDITOR","PORT_OPERATIONS_APPROVER"], companyTypesDenied: [CompanyType.SHIPPER]}], menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title:'Terminals',abbr:'mstermlId', route:NO_ROUTE, menus: []},
                {title:'Hazardous Restrictions',abbr:'mshrlId', route:NO_ROUTE, menus: []},
                {title:'Port Pairs',abbr:'msppId', route:NO_ROUTE, menus: []},
                {title:'Distances',abbr:'msdtId', route:NO_ROUTE, menus: []},
                {title:'Bunker Management',abbr:'financeBunkerMenuId', route:NO_ROUTE, restrictions: [{roles: ["BUNKER_EDITOR"]}], menus: []}
            ]};
        menu.push(schedulesMenu);
        const quotationsMenu = { groupTitle: "Quotations",  groupIcon: "request_quote", restrictions: [{roles: ["QUOTE_VIEWER","QUOTE_EDITOR","QUOTE_APPROVER"], companyPreferences: ["fullAccess"]}], menus: [
                {title: 'Search Quotes', abbr: 'mQuoteSearch', route:NO_ROUTE, menus: []},
                {title: 'Create Quote', abbr: 'createQuote2', route:NO_ROUTE, restrictions: [{roles: ["QUOTE_EDITOR","QUOTE_APPROVER"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT]}], menus: []}]};
        menu.push(quotationsMenu);
        const serviceContractMenu = { groupTitle: "Service contracts",  groupIcon: "home_repair_service", restrictions: [{roles: ["SERVICE_CONTRACT_VIEWER","SERVICE_CONTRACT_EDITOR","SERVICE_CONTRACT_APPROVER"], companyPreferences: ["fullAccess"]}], menus: [
                {title:'Search Service Contracts', abbr:'mscllID', route:NO_ROUTE, menus: []},{title:'Create Service Contract', abbr:'mscc2NewlId', route:NO_ROUTE, restrictions: [{companyTypesAllowed: [CompanyType.CARRIER], roles: ["SERVICE_CONTRACT_EDITOR","SERVICE_CONTRACT_APPROVER"], carrierPreferences: ["container"]}, {companyTypesDenied: [CompanyType.CARRIER], roles: ["SERVICE_CONTRACT_EDITOR","SERVICE_CONTRACT_APPROVER"]}], menus: []}]};
        menu.push(serviceContractMenu);
        const bookingsMenu = { groupTitle: "Bookings", groupIcon: "book", restrictions: [{roles: ["BOOKING_VIEWER","BOOKING_EDITOR","BOOKING_APPROVER"], companyPreferences: ["fullAccess"]}], menus: [
                {title: 'Search Bookings',abbr:'mbllId', route:NO_ROUTE, menus: []},
                {title: 'Create Container Booking',abbr:'mbclId', route:NO_ROUTE, restrictions: [{companyTypesAllowed: [CompanyType.CARRIER, CompanyType.AGENT, CompanyType.SHIPPER], roles: ["BOOKING_EDITOR","BOOKING_APPROVER"], carrierPreferences: ["container"]}], menus: []},
                {title: 'Create Break Bulk Booking',abbr:'mbcl2Id', route:NO_ROUTE, restrictions: [{companyTypesAllowed: [CompanyType.CARRIER, CompanyType.AGENT, CompanyType.SHIPPER], roles: ["BOOKING_EDITOR","BOOKING_APPROVER"], carrierPreferences: ["breakBulk"]}], menus: []},
                {title: 'Create RoRo Booking',abbr:'mbroroId', route:NO_ROUTE, restrictions: [{companyTypesAllowed: [CompanyType.CARRIER, CompanyType.AGENT, CompanyType.SHIPPER], roles: ["BOOKING_EDITOR","BOOKING_APPROVER"], carrierPreferences: ["roro"]}], menus: []},
                {title: 'Search Booking Templates',abbr:'mblblId', route:NO_ROUTE, menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title: 'Booking Reports',abbr:'mbbllId', route:NO_ROUTE, menus: []},
                {title: 'Dangerous Goods Reports',abbr:'mbdglId', route:NO_ROUTE, menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title: 'Booking Exceptions',abbr:'mbbexcep', route:NO_ROUTE, restrictions: [{roles: ["BOOKING_EDITOR"], companyTypesDenied: [CompanyType.SHIPPER]}], menus: []},
                {title: 'Dangerous Goods Approvals',abbr: 'dgrGoodsAppro', route:NO_ROUTE, restrictions: [{roles: ["DG_APPROVER"], companyTypesDenied: [CompanyType.SHIPPER]}], menus: []},
                {title: 'Haulage Logs',abbr:'mbbhaullog', route:NO_ROUTE, restrictions: [{roles: ["HAULAGE_CHARGE_VIEWER"]}], menus: []}
            ]};
        menu.push(bookingsMenu);
        const equipmentMenu: SidebarMenuModel = { groupTitle: "Equipment",  groupIcon: "view_comfy", restrictions: [{companyTypesDenied: [CompanyType.HAULIER], companyPreferences: ["fullAccess"]}], menus:
                [
                    {title: 'Container Events', abbr: 'meelId', route:NO_ROUTE, restrictions: [{roles: ["CONTAINER_ALLOCATOR"], companyTypesDenied: [CompanyType.SHIPPER]}], menus: []},
                    {title: 'Container Stock', abbr: 'meslId', route:NO_ROUTE, restrictions: [{roles: ["CONTAINER_STOCK_VIEWER"], companyTypesDenied: [CompanyType.SHIPPER]}], menus: []},
                    {title: 'Container Tracking', abbr: 'metlId', route:NO_ROUTE, menus: []},
                    {title: 'Container Location Stock List', abbr: 'mesllId', route:NO_ROUTE, restrictions: [{roles: ["CONTAINER_ALLOCATOR"], companyTypesDenied: [CompanyType.SHIPPER]}], menus: []},
                    {title: 'Container References', abbr: 'merrlId', route:NO_ROUTE, restrictions: [{roles: ["CONTAINER_ALLOCATOR"], companyTypesDenied: [CompanyType.SHIPPER]}], menus: []},
                    {title: 'Container Discharge Advice', abbr: 'medalId', route:NO_ROUTE, restrictions: [{roles: ["CONTAINER_ALLOCATOR"], companyTypesDenied: [CompanyType.SHIPPER]}], menus: []},
                    {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                    {title: 'Container Lease References', abbr: 'meclrlId', route:NO_ROUTE, restrictions: [{roles: ["CONTAINER_ALLOCATOR"], companyTypesDenied: [CompanyType.SHIPPER]}], menus: []},
                    {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                    {title: 'Container Contracts', abbr: 'mecclId', route:NO_ROUTE, restrictions: [{roles: ["CONTAINER_ALLOCATOR"], companyTypesAllowed: [CompanyType.CARRIER]}], menus: []},
                    {title: 'Create Container Contract', abbr: 'memcclId', route:NO_ROUTE, restrictions: [{roles: ["CONTAINER_ALLOCATOR"], companyTypesAllowed: [CompanyType.CARRIER]}], menus: []},
                    {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                    {title: 'Container Exceptions', abbr: 'meclsId', route:NO_ROUTE, restrictions: [{roles: ["CONTAINER_ALLOCATOR"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT]}], menus: []},
                    {title: 'Detention, Demurrage & Storage Shipment', abbr: 'meDemRepId', route:NO_ROUTE, restrictions: [{roles: ["CONTAINER_ALLOCATOR"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT]}], menus: []},
                    {title: 'Container Freetimes', abbr: 'containerFreetimes', route:NO_ROUTE, restrictions: [{roles: ["FREETIME_VIEWER"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT]}], menus: []},
                    {title: 'Container Freetimes and Charges', abbr: 'containerFreetimesAndCharges', route:NO_ROUTE, restrictions: [{roles: ["FREETIME_VIEWER"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT]}], menus: []},
                    {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                    {title: 'Equipment Admin', menuGroup: true, abbr: '@menuEquipment', route:NO_ROUTE, restrictions: [{roles: ["CONTAINER_ALLOCATOR","ADMIN","CONTAINER_STOCK_EDITOR","CONTAINER_STOCK_VIEWER"], companyTypesAllowed: [CompanyType.CARRIER]}], menus: [
                            {title: 'Container Lease Charges', abbr: 'meleaseChargeId', route:NO_ROUTE, restrictions: [{roles: ["CONTAINER_ALLOCATOR"]}], menus: []},
                            {title: 'Container Sub Lease Charges', abbr: 'mesubleaseChargeId', route:NO_ROUTE, restrictions: [{roles: ["CONTAINER_ALLOCATOR"]}], menus: []},
                            {title: 'Container Depots', abbr: 'mecdlId', route:NO_ROUTE, restrictions: [{roles: ["CONTAINER_ALLOCATOR"]}], menus: []},
                            {title: 'Container Operators', abbr: 'memcolId', route:NO_ROUTE, restrictions: [{roles: ["CONTAINER_STOCK_EDITOR"]}], menus: []},
                            {title: 'Container Event Sequences', abbr: 'meevlId', route:NO_ROUTE, restrictions: [{roles: ["CONTAINER_STOCK_EDITOR"]}], menus: []},
                            {title: 'Container Series', abbr: 'mecsId', route:NO_ROUTE, restrictions: [{roles: ["CONTAINER_STOCK_VIEWER"]}], menus: []},
                            {title: 'Secondary Event Mapping', abbr: 'mesemId', route:NO_ROUTE, restrictions: [{roles: ["CONTAINER_STOCK_EDITOR"]}], menus: []},
                            {title: 'Analyse Active Containers', abbr: 'analyseActiveContainers', route:NO_ROUTE, restrictions: [{roles: ["CONTAINER_ALLOCATOR"]}], menus: []},
                        ]},
                    {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                    {title: 'Container Vendor Jobs', menuGroup: true, abbr: '@containerMenuJobs', route:NO_ROUTE, restrictions: [{roles: ["VENDOR_JOB_EDITOR","VENDOR_JOB_APPROVER"], companyTypesAllowed: [CompanyType.CARRIER]}], menus: [
                            {title: 'Container Job Tariffs', abbr: '', route: 'vendor-jobs/tariff-list', menus: [], restrictions: [{roles: ["VENDOR_JOB_EDITOR","VENDOR_JOB_APPROVER"]}]},
                            {title: 'Container Jobs', abbr: 'mfJobsId', route:NO_ROUTE, menus: [], restrictions: [{roles: ["VENDOR_JOB_EDITOR","VENDOR_JOB_APPROVER"]}]},
                        ]},
                    {title: 'Maintenance & Repair', menuGroup: true, abbr: '', route:NO_ROUTE, restrictions: [{roles: ["MR_EDITOR","MR_VIEWER","MR_APPROVER"], companyTypesAllowed: [CompanyType.CARRIER]}], menus: [
                            {title: 'Repair Jobs', abbr: '', route:'mandr/repair-job', restrictions: [{roles: ["MR_EDITOR","MR_VIEWER","MR_APPROVER"]}], menus: []},
                            {title: 'Automatic Approval Limits', abbr: '', route:'mandr/approval-limits', restrictions: [{roles: ["MR_APPROVER"]}], menus: []},
                        ]},
                ]};
        menu.push(equipmentMenu);
        const documentMenu = { groupTitle: "Documents", groupIcon: "notes", restrictions: [{companyTypesAllowed: [CompanyType.SHIPPER], roles: ["SHIPPING_INSTRUCTION_VIEWER"], companyTypesDenied: [CompanyType.HAULIER]}, {companyTypesAllowed: [CompanyType.CARRIER, CompanyType.AGENT], companyPreferences: ["fullAccess"], roles: ["SHIPPING_INSTRUCTION_VIEWER"], companyTypesDenied: [CompanyType.HAULIER]}], menus: [
                {title:'Search Shipping instructions', abbr: 'mdlsilId', route:NO_ROUTE, restrictions: [{roles: ["SHIPPING_INSTRUCTION_VIEWER"]}], menus: []},
                {title:'Create Shipping Instruction', abbr: 'mdcsilId', route:NO_ROUTE, restrictions: [{roles: ["SHIPPING_INSTRUCTION_EDITOR","SHIPPING_INSTRUCTION_APPROVER"]}], menus: []},
                {title:'Search Bill of lading', abbr: 'mdbollId', route:NO_ROUTE, restrictions: [{roles: ["BILL_OF_LADING_VIEWER"]}], menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title:'Search Bill of Lading Clauses', abbr: 'mdlbollId', route:NO_ROUTE, restrictions: [{roles: ["SHIPPING_INSTRUCTION_EDITOR","SHIPPING_INSTRUCTION_APPROVER"], companyTypesAllowed: [CompanyType.CARRIER]}], menus: []},
                {title: 'Create Bill of Lading Clause', abbr: 'mdmbollId', route:NO_ROUTE, restrictions: [{roles: ["SHIPPING_INSTRUCTION_EDITOR","SHIPPING_INSTRUCTION_APPROVER"], companyTypesAllowed: [CompanyType.CARRIER]}], menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title: 'Create Cargo Manifest', abbr: 'mdccmlId', route:NO_ROUTE, restrictions: [{roles: ["SHIPPING_INSTRUCTION_EDITOR","SHIPPING_INSTRUCTION_APPROVER"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT]}], menus: []},
                {title: 'Manage Manifest Locks', abbr: 'mddmllId', route:NO_ROUTE, restrictions: [{roles: ["MANIFEST_LOCKER"], companyTypesDenied: [CompanyType.SHIPPER]}], menus: []},
                {title: 'Search Freight Corrections', abbr: 'mCor', route:NO_ROUTE, restrictions: [{roles: ["SHIPPING_INSTRUCTION_VIEWER"], companyTypesDenied: [CompanyType.SHIPPER]}], menus: []},
                {title:'Import Cargo Administration', abbr: 'adminImportId', route:NO_ROUTE, restrictions: [{roles: ["SHIPPING_INSTRUCTION_EDITOR","SHIPPING_INSTRUCTION_APPROVER"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT]}], menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title: 'SOLAS VGM', abbr: 'mSolas', route:NO_ROUTE, menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title: 'Manage', abbr: 'mManageManifest', route:NO_ROUTE, restrictions: [{companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT]}], menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title: 'Document Browser', abbr: 'mduplId', route:NO_ROUTE, restrictions: [{companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT], environmentFlags: ["ODYSSEY_S3_ENABLED"]}], menus: []}
            ]};
        menu.push(documentMenu);
        const financeMenu = { groupTitle: "Finance", groupIcon: "money", restrictions: [{roles: ["FREIGHT_INVOICE_VIEWER","FREIGHT_INVOICE_EDITOR","FREIGHT_INVOICE_APPROVER","TARIFF_VIEWER","TARIFF_EDITOR","TARIFF_APPROVER","FEE_VIEWER","FEE_EDITOR","FEE_APPROVER","DISCOUNT_VIEWER","DISCOUNT_EDITOR","DISCOUNT_APPROVER","DISBURSEMENT_ACCOUNT_EDITOR","DISBURSEMENT_ACCOUNT_APPROVER"]}], menus: [
                {title:'Search Freight invoices', abbr: 'mfslId', route:NO_ROUTE, restrictions: [{roles: ["FREIGHT_INVOICE_VIEWER","FREIGHT_INVOICE_EDITOR","FREIGHT_INVOICE_APPROVER"]}], menus: []},
                {title:'Create Freight Invoice', abbr: 'mfmaintlId', route:NO_ROUTE, restrictions: [{roles: ["FREIGHT_INVOICE_EDITOR","FREIGHT_INVOICE_APPROVER"]}], menus: []},
                {title:'Search Credit Notes', abbr: 'mflcnlId', route:NO_ROUTE, restrictions: [{roles: ["FREIGHT_INVOICE_VIEWER","FREIGHT_INVOICE_EDITOR","FREIGHT_INVOICE_APPROVER"]}], menus: []},
                {title:'Create Credit Note', abbr: 'mfcnmlId', route:NO_ROUTE, restrictions: [{roles: ["FREIGHT_INVOICE_EDITOR","FREIGHT_INVOICE_APPROVER"]}], menus: []},
                {title: 'Statement of Account', abbr: 'msoaId', route:NO_ROUTE, restrictions: [{roles: ["FREIGHT_INVOICE_VIEWER","FREIGHT_INVOICE_EDITOR","FREIGHT_INVOICE_APPROVER"]}], menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title: 'Disbursement Account', menuGroup: true, abbr: '@disbursementAccountMenu', route:NO_ROUTE, restrictions: [{roles: ["DISBURSEMENT_ACCOUNT_EDITOR","DISBURSEMENT_ACCOUNT_APPROVER"]}], menus: [
                        {title: 'Create Proforma Disbursement Account', abbr: 'mdaId', route:NO_ROUTE, restrictions: [{roles: ["DISBURSEMENT_ACCOUNT_EDITOR","DISBURSEMENT_ACCOUNT_APPROVER"]}], menus: []},
                        {title: 'Create Final Disbursement Account', abbr: 'mfdaId', route:NO_ROUTE, restrictions: [{roles: ["DISBURSEMENT_ACCOUNT_EDITOR","DISBURSEMENT_ACCOUNT_APPROVER"]}], menus: []},
                        {title: 'Disbursement Account Summary', abbr: 'sdaId', route:NO_ROUTE, restrictions: [{roles: ["DISBURSEMENT_ACCOUNT_EDITOR","DISBURSEMENT_ACCOUNT_APPROVER"]}], menus: []},
                        {title: 'Search Disbursement Account Templates', abbr: 'mdaTmpId', route:NO_ROUTE, restrictions: [{roles: ["DISBURSEMENT_ACCOUNT_EDITOR","DISBURSEMENT_ACCOUNT_APPROVER"]}], menus: []},
                        {title: 'Location Charges', abbr: 'mdaPrtId', route:NO_ROUTE, restrictions: [{roles: ["DISBURSEMENT_ACCOUNT_EDITOR","DISBURSEMENT_ACCOUNT_APPROVER"]}], menus: []}
                    ]},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title: 'Tariffs, Fees and Charges', menuGroup: true, abbr: '@tariffsFeesChargesMenu', route:NO_ROUTE, restrictions: [{roles: ["TARIFF_VIEWER","TARIFF_EDITOR","TARIFF_APPROVER","FEE_VIEWER","FEE_EDITOR","FEE_APPROVER"]}], menus: [
                        {
                            title: 'List and Edit Container Tariffs',
                            abbr: 'mflaetId',
                            route: NO_ROUTE,
                            menus: [],
                            restrictions: [{carrierPreferences: ['container']}]
                        },
                        {
                            title: 'List and Edit BreakBulk/LCL Tariffs',
                            abbr: 'mflaebbltId',
                            route: NO_ROUTE,
                            menus: [],
                            restrictions: [{carrierPreferences: ['breakBulk']}]
                        },
                        {
                            title: 'List and Edit RoRo Tariffs',
                            abbr: 'mflaebrrtId',
                            route: NO_ROUTE,
                            menus: [],
                            restrictions: [{carrierPreferences: ['roro']}]
                        },
                        {
                            title: 'List and Edit Container Fees',
                            abbr: 'mflaefId',
                            route: NO_ROUTE,
                            restrictions: [{roles: ["FEE_VIEWER", "FEE_EDITOR", "FEE_APPROVER"]}],
                            menus: []
                        },
                        {
                            title: 'List and Edit BreakBulk/LCL/RoRo Fees',
                            abbr: 'mflaeblfId',
                            route: NO_ROUTE,
                            restrictions: [{roles: ["FEE_VIEWER", "FEE_EDITOR", "FEE_APPROVER"]}],
                            menus: []
                        },
                        {
                            title: 'Search Discounts',
                            abbr: 'mflsdlId',
                            route: NO_ROUTE,
                            restrictions: [{roles: ["DISCOUNT_VIEWER", "DISCOUNT_EDITOR", "DISCOUNT_APPROVER"]}],
                            menus: []
                        },
                        {
                            title: 'Create New Discount',
                            abbr: 'mfmdisclId',
                            route: NO_ROUTE,
                            restrictions: [{
                                roles: ["(DISCOUNT_EDITOR", "DISCOUNT_APPROVER"],
                                companyTypesDenied: [CompanyType.SHIPPER]
                            }],
                            menus: []
                        }
                    ]},
                {title: 'Inland Haulage Charges', menuGroup: true, abbr: '@haulageChargesMenu', route:NO_ROUTE, restrictions: [{companyTypesAllowed: [CompanyType.CARRIER, CompanyType.AGENT], roles: ["HAULAGE_CHARGE_VIEWER"]}], menus: [
                        {title: 'Haulage Charges (basis Distance)', abbr: 'haulageChargesDistance', route:NO_ROUTE, menus: []},
                        {title: 'Haulage Charges (basis Location)', abbr: 'haulageChargesLocation', route:NO_ROUTE, menus: []},
                        {title: 'Routing Options', abbr: 'financeRoutingOptions', route:NO_ROUTE, menus: []}
                    ]},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title: 'Exchange Rates', abbr: 'mmcrlId', route:NO_ROUTE, restrictions: [{roles: ["TARIFF_APPROVER"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT]}], menus: []},
                {title: 'Search Exchange Rates', abbr: 'mmcrlmId', route:NO_ROUTE, menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title: 'Cost Control', menuGroup: true, abbr: '@costControlMenu', route:NO_ROUTE, menus: [
                        {title: 'Container Terminal Invoice Control', abbr: 'mfmcontDInvId', route:NO_ROUTE, menus: []},
                        {title: 'Container Depot Invoice Control', abbr: 'mfmcontTInvId', route:NO_ROUTE, menus: []},
                        {title: 'Agency Commission Invoice Control', abbr: 'mfmcontAInvId', route:NO_ROUTE, menus: []}
                    ]},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title: 'Finance Admin', menuGroup: true, abbr: '@financeAdminMenu', route:NO_ROUTE, restrictions: [{roles: ["ADMIN"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT]}], menus: [
                        {title: 'Map Account Codes', abbr: 'mfacclId', route:NO_ROUTE, restrictions: [{roles: ["ADMIN"], companyTypesDenied: [CompanyType.SHIPPER]}], menus: []},
                        {title: 'Charge Groups', abbr: 'mfmcglId', route:NO_ROUTE, restrictions: [{roles: ["FEE_APPROVER","TARIFF_APPROVER"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT]}], menus: []},
                        {title: 'Container Type Groups', abbr: 'mfmctgId', route:NO_ROUTE, restrictions: [{roles: ["ADMIN"], companyTypesAllowed: [CompanyType.CARRIER], companyPreferences: ["fullAccess"]}], menus: []},
                        {title: 'Port Groups', abbr: 'mfpglId', route:NO_ROUTE, restrictions: [{roles: ["ADMIN"], companyTypesAllowed: [CompanyType.CARRIER], companyPreferences: ["fullAccess"]}], menus: []},
                        {title: 'Commodity Groups', abbr: 'mfcmgId', route:NO_ROUTE, restrictions: [{roles: ["ADMIN"], companyTypesAllowed: [CompanyType.CARRIER], companyPreferences: ["fullAccess"]}], menus: []},
                        {title: 'Transaction Groups', abbr: 'mfftgId', route:NO_ROUTE, restrictions: [{roles: ["ADMIN"], companyTypesAllowed: [CompanyType.CARRIER], companyPreferences: ["fullAccess"]}], menus: []}
                    ]}
            ]};
        menu.push(financeMenu);
        const crmMenu = { groupTitle: "CRM",  groupIcon: "person", restrictions: [{roles: ["SHIPPING_INSTRUCTION_VIEWER","BOOKING_VIEWER","QUOTE_VIEWER","SERVICE_CONTRACT_VIEWER","ACCOUNT_EDITOR","ACCOUNT_APPROVER"], companyTypesDenied: [CompanyType.HAULIER]}], menus: [
                {title:'Activity', abbr: 'mcactId', route:NO_ROUTE, restrictions: [{roles: ["ACCOUNT_EDITOR","ACCOUNT_APPROVER"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT]}], menus: []},
                {title:'Case Management', abbr: 'mccaseId', route:NO_ROUTE, restrictions: [{roles: ["ACCOUNT_EDITOR","ACCOUNT_APPROVER"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT]}], menus: []},
                {title:'Account Management', abbr: 'mlacId', route:NO_ROUTE, restrictions: [{roles: ["ACCOUNT_EDITOR","ACCOUNT_APPROVER"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT]}], menus: []},
                {title:'Register New Account', abbr: 'mcacId', route:NO_ROUTE, restrictions: [{roles: ["ACCOUNT_EDITOR","ACCOUNT_APPROVER"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT]}], menus: []},
                {title: 'Import Accounts', abbr: 'mcaccimpID', route:NO_ROUTE, restrictions: [{roles: ["ACCOUNT_EDITOR","ACCOUNT_APPROVER"], companyTypesAllowed: [CompanyType.CARRIER]}], menus: []},
                {title: 'Import Account Bank Details', abbr: 'maccimpbankID', route:NO_ROUTE, restrictions: [{roles: ["ACCOUNT_EDITOR","ACCOUNT_APPROVER"], companyTypesAllowed: [CompanyType.CARRIER]}], menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title:'Supplier Management', abbr: 'mlsuId', route:NO_ROUTE, restrictions: [{roles: ["ACCOUNT_EDITOR","ACCOUNT_APPROVER"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT]}], menus: []},
                {title: 'Register New Supplier', abbr: 'mcsuId', route:NO_ROUTE, restrictions: [{roles: ["ACCOUNT_EDITOR","ACCOUNT_APPROVER"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT]}], menus: []},
                {title: 'Import Suppliers', abbr: 'msuppimpID', route:NO_ROUTE, restrictions: [{roles: ["ACCOUNT_EDITOR","ACCOUNT_APPROVER"], companyTypesAllowed: [CompanyType.CARRIER]}], menus: []},
                {title:'Import Suppliers Bank Details', abbr: 'msuppimpbankID', route:NO_ROUTE, restrictions: [{roles: ["ACCOUNT_EDITOR","ACCOUNT_APPROVER"], companyTypesAllowed: [CompanyType.CARRIER]}], menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title: 'Search Local Addresses', abbr: 'mclalId', route:NO_ROUTE, menus: []},
                {title: 'Create Local Addresses', abbr: 'mcclID', route:NO_ROUTE, menus: []},
                {title: 'Import Local Addresses', abbr: 'mcimpID', route:NO_ROUTE, menus: []}
            ]};
        menu.push(crmMenu);
        const dataMenu = {groupTitle: "Data",  groupIcon: "data_usage", restrictions: [{roles: ["DATA_VIEWER"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT], companyPreferences: ["fullAccess"]}], menus: [
                {title: 'Message Centre', abbr: 'mdamclId', route:NO_ROUTE, menus: []},
                {title: 'Message Centre Dev', abbr: 'mdamclIdDev', route:NO_ROUTE, restrictions: [{roles: ["DEVELOPER"]}], menus: []},
                {title: 'Partner Connections', abbr: 'mdadpclId', route:NO_ROUTE, menus: []},
                {title: 'EDI Import', abbr: 'mdaediImpId', route:NO_ROUTE, restrictions: [{roles: ["DATA_EDITOR"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT]}], menus: []},
                {title: 'Custom Data Mappings', abbr: 'mdamcdmlId', route:NO_ROUTE, restrictions: [{roles: ["DATA_EDITOR"]}], menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title: 'BAPLIE - Import Bay Plan', abbr: 'mdaiblId', route:NO_ROUTE, restrictions: [{roles: ["DATA_EDITOR"]}], menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title: 'COPRAR - Generate Load/Discharge List', abbr: 'mdagclId', route:NO_ROUTE, menus: []},
                {title: 'BPLIE - Generate Baplie List', abbr: 'mdbaplId', route:NO_ROUTE, menus: []},
                {title: 'VERMAS - Generate VGM Vermas Message', abbr: 'mdagverId', route:NO_ROUTE, menus: []},
                {title: 'Generate Customs Manifest', abbr: 'mdadgclId', route:NO_ROUTE, menus: []},
                {title: 'ICS IE323 - Odyssey Booking and SI Import', abbr: 'icsie323Id', route:NO_ROUTE, restrictions: [{roles: ["DATA_EDITOR"]}], menus: []},
                {title: 'ICS IE347 - Import Booking Spreadsheet', abbr: 'icsie347Id', route:NO_ROUTE, restrictions: [{roles: ["DATA_EDITOR"]}], menus: []},
                {title: 'Odyssey Booking and SI Import', abbr: 'mdabookIId', route:NO_ROUTE, restrictions: [{roles: ["DATA_EDITOR"]}], menus: []},
                {title: 'Import Booking Spreadsheet', abbr: 'mdainitlId', route:NO_ROUTE, restrictions: [{roles: ["DATA_EDITOR"]}], menus: []},
                {title: 'Original BL Import', abbr: 'mdainiblmId', route:NO_ROUTE, restrictions: [{roles: ["DATA_EDITOR"]}], menus: []},
                {title: 'Import MRN Spreadsheet', abbr: 'mdainimrmId', route:NO_ROUTE, menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title: 'Export DTX', abbr: 'mdaedtxlId', route:NO_ROUTE, menus: []},
                {title: 'Export Container Stock', abbr: 'mdaecsID', route:NO_ROUTE, menus: []},
                {title: 'Export Container Moves', abbr: 'mdacmlId', route:NO_ROUTE, menus: []},
                {title: 'Export Booking Data', abbr: 'mdaebdId', route:NO_ROUTE, menus: []},
            ]};
        menu.push(dataMenu);
        const administrationMenu = { groupTitle: "Administration", groupIcon: "group", restrictions: [{roles: ["ADMIN"]}], menus: [
                {title:'Users', abbr: 'mamulId', route:NO_ROUTE, restrictions: [{roles: ["ADMIN"]}], menus: []},
                {title:'Groups', abbr: 'mamglId', route:NO_ROUTE, restrictions: [{roles: ["ADMIN"]}], menus: []},
                {title:'Analytics Management', abbr: 'maanlId', route:NO_ROUTE, restrictions: [{roles: ["ADMIN"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT ]}], menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title:'Notifications', abbr: 'mamnlId', route:NO_ROUTE, restrictions: [{roles: ["ADMIN"], companyTypesAllowed: [CompanyType.CARRIER], companyPreferences: ["fullAccess"]}], menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title:'Business Units', abbr: 'mambulId', route:NO_ROUTE, restrictions: [{roles: ["ADMIN"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT ]}], menus: []},
                {title:'Branches', abbr: 'mamblId', route:NO_ROUTE, restrictions: [{roles: ["ADMIN"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT ], companyPreferences: ["fullAccess"]}], menus: []},
                {title:'Associations', abbr: 'mamalId', route:NO_ROUTE, restrictions: [{roles: ["ADMIN"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT ], companyPreferences: ["fullAccess"]}], menus: []},
                {title: 'div', abbr: '', route:NO_ROUTE, menus: []},
                {title:'Reports and Templates', abbr: 'mamrtlId', route:NO_ROUTE, restrictions: [{roles: ["ADMIN"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT ], companyPreferences: ["fullAccess"]}], menus: []},
                {title:'Email Templates', abbr: 'mamemailTempId', route:NO_ROUTE, restrictions: [{roles: ["ADMIN"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT ], companyPreferences: ["fullAccess"]}], menus: []},
                {title:'Company Preferences', abbr: 'mamcplId', route:NO_ROUTE, restrictions: [{roles: ["ADMIN"], companyTypesDenied: [CompanyType.HAULIER]}], menus: []},
                {title:'Document Counters', abbr: 'madoclId', route:NO_ROUTE, restrictions: [{roles: ["ADMIN"], companyTypesAllowed: [CompanyType.CARRIER,CompanyType.AGENT], companyPreferences: ["fullAccess"]}], menus: []},
                {title:'Workflow Administration', abbr: 'wfId', route:NO_ROUTE, restrictions: [{roles: ["ADMIN"]}], menus: []}
            ]};
        menu.push(administrationMenu);
        this.sideBarWideMenu = menu;
        this.onHome();
    }


  onSignOut(): void {
    this.legacyView = false;
    this.router.navigate(['/cover-page']);
  }

  onHome(): void {
    const homeMenu: SubMenu = {title:'Home',abbr:'mhlId', route:NO_ROUTE, menus: []};
    this.onMenuChanged(homeMenu);
  }

  onDrawerClose(): void {

  }

  onMenuChanged(menuItem: SubMenu): void {
    this.subHeaderToolbarService.module = menuItem.title;
    if (NON_LEGACY_MENUS.has(menuItem.title) || (menuItem.route && NO_ROUTE !== menuItem.route)) {
      this.legacyView = false;
      this.router.navigate(['/welcome/'+ menuItem.route]);
    } else {
      this.odysseyLegacyService.changeMenu(menuItem.abbr);
    }
  }

  changeMenu(menuTitle: string): void {

  }

  onSelect(event: any): void {
  }

  onLoad(event: any): void {
  }

  toggleLeftSideBar(): void {

    if (this.leftDrawer.mode === 'over') {
      return;
    }

    if (this.leftSideBarState === 'maximized') {
      this.leftSideBarState = 'minimized';
      this.leftNavWidth = 50;
    } else {
      this.leftSideBarState = 'maximized';
      this.leftNavWidth = 230;
    }
    this.animatedResizeEvent();

  }

  animatedResizeEvent(): void {
    setTimeout(() => {
      // Another event for once the animation is finished
      window.dispatchEvent(new Event('resize'));
    }, 0);
  }

  onSidebarMenuChanged(menuModel: SidebarMenuModel): void {
    this.expandedMenu = menuModel.groupTitle;
  }

}
