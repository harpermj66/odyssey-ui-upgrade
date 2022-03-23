import {FindModel} from "./find-model";

export class ResultModel {
  constructor(public content: any[], public totalRecords: number, public findModel: FindModel) {
  }
}


