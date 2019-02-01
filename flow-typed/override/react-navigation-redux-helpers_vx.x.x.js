// flow-typed signature: b8a680fd14eb42d5cade5b210beb46ba
// flow-typed version: <<STUB>>/react-navigation-redux-helpers_v2.0.9/flow_v0.89.0

/**
 * This is an autogenerated libdef stub for:
 *
 *   'react-navigation-redux-helpers'
 *
 * Fill this stub out by replacing all the `any` types.
 *
 * Once filled out, we encourage you to share your work with the
 * community by sending a pull request to:
 * https://github.com/flowtype/flow-typed
 */
import {
  type NavigationContainer,
  type NavigationDispatch,
  type NavigationScreenProp,
  type NavigationState,
} from 'react-navigation'
import {
  type Middleware,
  type Reducer,
} from 'redux'
import React from 'react'

declare module 'react-navigation-redux-helpers' {
  // Current
  declare export function createReactNavigationReduxMiddleware<State: {}>(
    key: string,
    navStateSelector: (state: State) => NavigationState,
  ): Middleware<State, *, *>;

  declare type RequiredProps<State: NavigationState> = {
      state: State,
      dispatch: NavigationDispatch,
    };
  declare type InjectedProps<State: NavigationState> = {
    navigation: NavigationScreenProp<State>,
  };

  declare export function reduxifyNavigator<State: NavigationState, Props: RequiredProps<State>>(
    Navigator: NavigationContainer<
      State,
      *,
      $Diff<Props, RequiredProps<State>>,
    >,
    key: string,
  ): React.ComponentType<Props>;

}
