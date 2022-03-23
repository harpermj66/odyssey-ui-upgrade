export class SidebarMode {
    state: SidebarState;
    matDrawerMode: string;
    width: number;
    default: boolean;
}

export enum SidebarState {
    CLOSED = 'closed',
    OPENED = 'opened',
}

export const sidebarModes: SidebarMode[] = [
    { state: SidebarState.CLOSED, matDrawerMode: 'side', width: 72, default: true },
    { state: SidebarState.OPENED, matDrawerMode: 'over', width: 240, default: false },
];

export function getSidebarMode(matDrawerMode: string): SidebarMode {
    const sidebar = sidebarModes.find(s => s.matDrawerMode === matDrawerMode);

    return sidebar ? sidebar : sidebarModes[0];
}

export function getDefaultSidebarMode(): SidebarMode {
    const defaultSidebar = sidebarModes.find(s => s.default);

    if (!defaultSidebar) {
        throw TypeError("No default SidebarMode found.");
    }

    return defaultSidebar;
}



