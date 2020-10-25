import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {IRSignalEntityService} from './ir-signal-entity.service';
import {filter, first, map, tap} from 'rxjs/operators';


@Injectable()
export class IRSignalsResolver implements Resolve<boolean> {

    constructor(private IRSignalsService: IRSignalEntityService) {

    }

    resolve(route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<boolean> {

        return this.IRSignalsService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                       this.IRSignalsService.getAll();
                    }
                }),
                filter(loaded => !!loaded),
                first()
            );

    }

}
