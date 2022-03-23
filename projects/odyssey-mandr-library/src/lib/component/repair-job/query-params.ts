export class RepairJobEditQueryParams {
  mode?: 'view' | 'edit' = 'view';
  repairJobId?: number | null;
}


export class RepairItemEditQueryParams {
  mode?: 'view' | 'edit' = 'view';
  parentMode?: 'view' | 'edit' = 'view';
  repairJobId?: number;
  repairItemId?: number;
}
