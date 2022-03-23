import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {RepairJobService} from "./repair-job.service";
import {Injectable} from "@angular/core";
import {PageableModel} from "../../../model/pageable.model";
import {Observable, throwError} from "rxjs";
import {PageModel} from "../../../model/page.model";
import {AttachmentInfoVoModel} from "../model/attachment-info-vo.model";
import {FileUploadModel} from "../model/file-upload.model";
import {AttachmentVoModel} from "../model/attachment-vo.model";

@Injectable()
export class RepairJobAttachmentService {
  public static readonly PATH_ATTACHMENT = '/attachment';
  public static readonly PATH_ATTACHMENT_INFO = '/attachment-information';
  public static readonly PATH = 'mandr-service/api' + RepairJobAttachmentService.PATH_ATTACHMENT;

  constructor(private http: HttpClient) {
  }

  public getAttachmentInfosForRepairJob(repairJobId: number, pageable: PageableModel): Observable<PageModel<AttachmentInfoVoModel>> {
    const params = PageableModel.toHttpParams(pageable);
    return this.http.get(this.getRepairJobRelativeInfoPath(repairJobId), {params}) as Observable<PageModel<AttachmentInfoVoModel>>;
  }

  public getAttachment(attachmentId: number): Observable<AttachmentVoModel> {
    const params = new HttpParams();
    return this.http.get(RepairJobAttachmentService.PATH + '/' + attachmentId, {params}) as Observable<AttachmentVoModel>;
  }

  public addAttachmentToRepairJob(repairJobId: number, fileUpload: FileUploadModel): Observable<AttachmentInfoVoModel> {
    const params = new HttpParams();

    const formData = new FormData();
    if(fileUpload.file && fileUpload.fileName && fileUpload.name && fileUpload.description && fileUpload.contentType && fileUpload.size) {
      formData.set('file', fileUpload.file);
      formData.set('fileName', fileUpload.fileName);
      formData.set('name', fileUpload.name);
      formData.set('description', fileUpload.description);
      formData.set('contentType', fileUpload.contentType);
      formData.set('size', fileUpload.size.toString());

      if(fileUpload.keywords) {
        formData.set('keywords', fileUpload.keywords);
      }
    } else {
      return throwError(new Error('Missing parameters for file upload'));
    }

    return this.http.put(this.getRepairJobRelativePath(repairJobId), formData, {params}) as Observable<AttachmentInfoVoModel>;
  }

  public deleteAttachment(attachmentId: number): Observable<any> {
    const params = new HttpParams();
    return this.http.delete(RepairJobAttachmentService.PATH + '/' + attachmentId, {params}) as Observable<any>;
  }

  private getRepairJobRelativePath(repairJobId: number): string {
    return RepairJobService.PATH + '/' + repairJobId + RepairJobAttachmentService.PATH_ATTACHMENT;
  }

  private getRepairJobRelativeInfoPath(repairJobId: number): string {
    return RepairJobService.PATH + '/' + repairJobId + RepairJobAttachmentService.PATH_ATTACHMENT_INFO;
  }


}
