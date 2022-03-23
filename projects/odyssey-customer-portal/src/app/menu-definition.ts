import {SidebarMenuModel} from "../../../odyssey-shared-views/src/lib/sidebar-menus/sidebar-menu.model";

const dashboardMenu: SidebarMenuModel = {
    groupTitle: "Dashboard",
    groupIcon: "home",
    groupRoute: "dashboard",
    menus: []
};

const routeFinderMenu: SidebarMenuModel = {
    groupTitle: "Route Planner",
    groupIcon: "route",
    groupRoute: "route-finder",
    menus: []
};

const containerTrackingMenu: SidebarMenuModel = {
    groupTitle: "Container Tracking",
    groupIcon: "search",
    groupRoute: "container-tracking",
    menus: []
};

const adminMenu = {
    groupTitle: "Admin",
    groupIcon: "admin_panel_settings",
    groupRoute: "admin",
    menus: [
        /*{
            title: "Create User",
            abbr: "create-user",
            route: "create-user",
            icon: "group_add",
            menus: []
        }*/
    ],
};

export const sidebarMenus: SidebarMenuModel[] = [
    dashboardMenu,
    routeFinderMenu,
    containerTrackingMenu,
    adminMenu,
];
