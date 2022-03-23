import {Role} from "./role";
import {User} from "./user";

export class PermissionGroup {
    keycloakId: string;
    name: string;
    displayName: string;
    description: string;
    roles: Role[];
    users: User[];
    odysseyCompanyId: number;
    checked: boolean;
}
