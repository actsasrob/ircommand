import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {RemoteDashEntityService} from './remote-dash-entity.service';
import {filter, first, map, tap} from 'rxjs/operators';


@Injectable()
export class RemoteDashesResolver implements Resolve<boolean> {

    constructor(private remoteDashesService: RemoteDashEntityService) {

    }

    resolve(route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<boolean> {

        return this.remoteDashesService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                       this.remoteDashesService.getAll();
                    }
                }),
                filter(loaded => !!loaded),
                first()
            );

    }

}
