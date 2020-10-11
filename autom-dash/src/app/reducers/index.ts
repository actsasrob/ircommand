import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import {AuthActions} from '../auth/action-types';
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
        console.log("state before: ", state);
        console.log("action", action);

        return reducer(state, action);
    }

}

export function clearState(reducer) {
  return function (state, action) {
    //console.log("reducers.clearState: action=" + JSON.stringify(action));
    console.log("reducers.clearState: action.type=" + action.type);
    if (action.type === AuthActions.logout) {
      state = undefined;
    }

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<AppState>[] =
    !environment.production ? [logger, clearState] : [clearState];


