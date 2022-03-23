import {ComponentFactory, ComponentFactoryResolver, Injectable} from "@angular/core";
import {ManageFavouritesComponent} from "../../../../odyssey-shared-views/src/lib/favourites/manage-favourites/manage-favourites.component";
import {HelpEmbeddedViewComponent} from "../../../../odyssey-shared-views/src/lib/help/help-embedded-view/help-embedded-view.component";

@Injectable()
export class ApplicationComponentResolverService {

  constructor(private resolver: ComponentFactoryResolver) {

  }

  getComponentFactory(viewId: string): ComponentFactory<any> {
    let factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(ManageFavouritesComponent);
    switch (viewId) {
      case 'ManageQuickSearchFavourites': factory = this.resolver.resolveComponentFactory(ManageFavouritesComponent); break;
      case 'HelpEmbeddedView': factory = this.resolver.resolveComponentFactory(HelpEmbeddedViewComponent); break;
    }
    return factory;
  }
}
