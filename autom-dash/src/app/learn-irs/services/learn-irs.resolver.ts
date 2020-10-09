import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {LearnIREntityService} from './learn-ir-entity.service';
import {filter, first, map, tap} from 'rxjs/operators';


@Injectable()
export class LearnIRsResolver implements Resolve<boolean> {

    constructor(private learnIRsService: LearnIREntityService) {

    }

    resolve(route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<boolean> {

        return this.learnIRsService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                       this.learnIRsService.getAll();
                    }
                }),
                filter(loaded => !!loaded),
                first()
            );

    }

}
