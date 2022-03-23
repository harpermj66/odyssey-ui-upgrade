import {ContainerJobTariffModel} from "../../../../../odyssey-service-library/src/lib/vendorjobs/container-job-tariff/model/container-job-tariff.model";
import {Flatten} from "../../../../../odyssey-service-library/src/lib/utils/flatten";
import {ContainerJobTariffTypePipe} from "../../../../../odyssey-service-library/src/lib/vendorjobs/container-job-tariff/pipes/container-job-tariff-type.pipe";

export class FlatJobTariff extends ContainerJobTariffModel {
  [fieldName: string]: any;

  constructor(tariff: ContainerJobTariffModel) {
    super();
    Object.assign(this, tariff);
    Object.assign(this, Flatten.flatten(tariff));
    this.jobType = ContainerJobTariffTypePipe.format(this.jobType);
  }
}
