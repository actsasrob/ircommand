import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class RemoteDashItemMessageService {

  // Observable string sources
  private toChildrenSource = new Subject<string>();
  private fromChildrenSource = new Subject<string>();

  // Observable string streams
  toChildren$ = this.toChildrenSource.asObservable();
  fromChildren$ = this.fromChildrenSource.asObservable();

  // Service message commands
  sendToChildren(message: string) {
    this.toChildrenSource.next(message);
  }

  receiveFromChildren(message: string) {
    this.fromChildrenSource.next(message);
  }
}
