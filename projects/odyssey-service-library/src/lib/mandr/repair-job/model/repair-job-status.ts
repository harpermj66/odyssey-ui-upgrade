export class RepairJobStatus {
  public static readonly STATUS_DRAFT = 'DRAFT';
  public static readonly STATUS_PENDING = 'SUBMITTED';
  public static readonly STATUS_APPROVED = 'APPROVED';
  public static readonly STATUS_APPROVED_AND_SENT = 'APPROVED_AND_SENT';
  public static readonly STATUS_REJECTED = 'REJECTED';
  public static readonly STATUS_COMPLETE = 'COMPLETE';

  public static readonly DISPLAY_STATUS_DRAFT = 'Draft';
  public static readonly DISPLAY_STATUS_PENDING = 'Pending';
  public static readonly DISPLAY_STATUS_APPROVED = 'Approved';
  public static readonly DISPLAY_STATUS_APPROVED_AND_SENT = 'Approved and Sent';
  public static readonly DISPLAY_STATUS_REJECTED = 'Rejected';
  public static readonly DISPLAY_STATUS_COMPLETE = 'Complete';

  public static getDisplayName(status?: string | null): string {
    let display = 'Unknown';

    if(status) {
      switch (status) {
        case RepairJobStatus.STATUS_DRAFT:
          display = this.DISPLAY_STATUS_DRAFT;
          break;
        case RepairJobStatus.STATUS_PENDING:
          display = this.DISPLAY_STATUS_PENDING;
          break;
        case RepairJobStatus.STATUS_APPROVED:
          display = this.DISPLAY_STATUS_APPROVED;
          break;
        case RepairJobStatus.STATUS_APPROVED_AND_SENT:
          display = this.DISPLAY_STATUS_APPROVED_AND_SENT;
          break;
        case RepairJobStatus.STATUS_REJECTED:
          display = this.DISPLAY_STATUS_REJECTED;
          break;
        case RepairJobStatus.STATUS_COMPLETE:
          display = this.DISPLAY_STATUS_COMPLETE;
          break;
      }
    }

    return display;
  }
}
