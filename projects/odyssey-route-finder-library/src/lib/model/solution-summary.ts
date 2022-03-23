import {SolutionDetail} from "./solution-detail";

export class SolutionSummary {
  public departs: string = '';
  public arrives: string = '';
  public eta: Date = new Date();
  public etd: Date = new Date();
  public duration: string = '';
  public legs: Number = 1;
  public tsPorts: string = '';
  public showDetail = false;
  public details: SolutionDetail[] = [];
}
