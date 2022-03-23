import {Voyage} from './voyage';

export class ContainerEvent {
    public containerNumber = '';
    public date = '';
    public eventType = '';
    public location = '';
    public locode = '';
    public voyage: Voyage;
    public booking = 0;
    public reference = '';
    public loadNumber = '';
    public emptyFull = '';
    public comment = '';
    public method = '';
    public carrier = '';
    public carrierId = '';
}
