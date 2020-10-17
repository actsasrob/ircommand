import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {RemoteDashEntityService} from './remote-dash-entity.service';
import {filter, first, map, tap} from 'rxjs/operators';


@Injectable()
export class RemoteDashesResolver implements Resolve<boolean> {

    constructor(private RemoteDashesService: RemoteDashEntityService) {

    }

    resolve(route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<boolean> {

        return this.RemoteDashesService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                       this.RemoteDashesService.getAll();
                    }
                }),
                filter(loaded => !!loaded),
                first()
            );

    }

}
