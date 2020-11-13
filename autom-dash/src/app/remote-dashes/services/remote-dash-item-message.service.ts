import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class RemoteDashItemMessageService {

  // Observable string sources
  private toChildrenSource = new Subject<string>();
  private fromChildrenSource = new Subject<string>();
  private IRSignalFromChildrenSource = new Subject<string>();

  // Observable string streams
  toChildren$ = this.toChildrenSource.asObservable();
  fromChildren$ = this.fromChildrenSource.asObservable();
  IRSignalFromChildren$ = this.IRSignalFromChildrenSource.asObservable();

  // Service message commands
  sendToChildren(message: string) {
    this.toChildrenSource.next(message);
  }

  // for data changes from child
  receiveFromChildren(message: string) {
    this.fromChildrenSource.next(message);
  }

  // send IR Signal initiated from child
  sendIRSignal(message: string) {
    this.IRSignalFromChildrenSource.next(message);
  }
}
