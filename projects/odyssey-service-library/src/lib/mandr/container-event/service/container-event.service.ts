import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ContainerEventVoModel} from "../model/container-event-vo.model";

@Injectable()
export class ContainerEventService {
  public static readonly PATH = 'mandr-service/api/container-event';

  constructor(private http: HttpClient) {
  }

  /**
   * Get the last turn in event for a container.
   *
   * @param containerNumber The container number.
   */
  public getLastTurnInEvent(containerNumber: string): Observable<ContainerEventVoModel> {
    return this.http.get(ContainerEventService.PATH + '/' + containerNumber + '/latest-turn-in') as Observable<ContainerEventVoModel>;
  }

  /**
   * Get the last turn in event for a container for a given terminal.
   *
   * @param containerNumber The container number.
   * @param terminalId The ID of the terminal.
   */
  public getLastTurnInEventForTerminal(containerNumber: string, terminalId: number): Observable<ContainerEventVoModel> {
    const params = new HttpParams().set('terminalId', terminalId.toString());
    return this.http.get(ContainerEventService.PATH + '/' + containerNumber + '/latest-turn-in',
      {params}) as Observable<ContainerEventVoModel>;
  }

  /**
   * Get the last turn in event for a container for a given terminal.
   *
   * @param containerNumber The container number.
   * @param depotId The ID of the depot
   */
  public getLastTurnInEventForDepot(containerNumber: string, depotId: number): Observable<ContainerEventVoModel> {
    const params = new HttpParams().set('depotId', depotId.toString());
    return this.http.get(ContainerEventService.PATH + '/' + containerNumber + '/latest-turn-in',
      {params}) as Observable<ContainerEventVoModel>;
  }
}
