import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';

import { logout as auth_logout } from '../auth/auth.actions';

import { environment } from '../../environments/environment';
import {routerReducer} from '@ngrx/router-store';

export interface AppState {

}

export const reducers: ActionReducerMap<AppState> = {
    router: routerReducer
};

export function logger(reducer:ActionReducer<any>)
    : ActionReducer<any> {
    return (state, action) => {
        //console.log("logger: state before: ", state);
        //console.log("logger: action", action);

        return reducer(state, action);
    }

}

export function logout(reducer: ActionReducer<any>): ActionReducer<any> {
    return function(state, action) {

      //console.log("logout(): " + JSON.stringify(action));
      switch (action.type) {
          case auth_logout.type:          
            console.log("logout action");   
            state = undefined;
      }

      return reducer(state, action);  
    }
}


export const metaReducers: MetaReducer<AppState>[] =
    !environment.production ? [logger, logout] : [logger, logout];


