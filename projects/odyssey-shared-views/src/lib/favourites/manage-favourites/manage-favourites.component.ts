import {Component, OnInit} from '@angular/core';
import {IRightViewComponent} from "../../../../../odyssey-home/src/app/home/slide-out-right-view/slide-out-right-view-subscriber.service";

@Component({
  selector: 'lib-manage-favourites',
  templateUrl: './manage-favourites.component.html',
  styleUrls: ['./manage-favourites.component.scss']
})
export class ManageFavouritesComponent implements OnInit, IRightViewComponent {

  typesOfShoes: string[] = ['Trade Tag *03*', 'Created by *hox and Created by *wi*', 'Route *am*', 'Voyage *asdf*', 'Status Complete'];

  constructor() { }

  ngOnInit(): void {
  }

  setArguments(args: any): void {
  }

}
