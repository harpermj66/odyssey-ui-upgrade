import { Restriction } from "../../../../odyssey-service-library/src/lib/authentication/current-user.service";

export class SidebarMenuModel {
  groupTitle = '';
  groupIcon = '';
  restrictions?: Restriction[];
  menus: SubMenu[] = [];
  groupRoute?: string;

  /**
   * Whether this menu item actually has anything to do.
   */
  public static notEmpty(menu?: SidebarMenuModel): boolean {
    return !!menu && menu.menus.length > 0;
  }
}

export class SubMenu {
  title = '';
  abbr = 'mhlId';
  route = '/welcome/route-not-found/';
  restrictions?: Restriction[];
  menuGroup?: boolean;
  menus: SubMenu[] = [];
  icon?: string;

  /**
   * Recursively trims this sub menu list to removed any menus that do not actually have any submenus and do nothing when clicked on.
   */
  public static trimEmptyMenus(submenu?: SubMenu[]): SubMenu[] {
    return submenu ? submenu.filter(it => {
      it.menus = SubMenu.trimEmptyMenus(it.menus);
      return SubMenu.notEmpty(it);
    }) : [];
  }

  /**
   * Whether this menu has anything to do.
   * Will return true if this menu has sub menus or does something when clicked on.
   */
  public static notEmpty(submenu?: SubMenu): boolean {
    return !!submenu
        && (!(!submenu.abbr || submenu.abbr === '')
            || !(!submenu.route || submenu.route === 'route-not-found')
            || submenu.menus.length > 0);
  }
}
