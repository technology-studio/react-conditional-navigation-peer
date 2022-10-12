/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2017-11-05T19:13:46+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
**/

// TODO: figure out if this is needed
import type * as React from 'react'
import type {
  NavigationContainer,
  NavigationState,
  NavigationDispatch,
} from 'react-navigation'
import { createReduxContainer } from 'react-navigation-redux-helpers'
import type { ConnectedComponent } from 'react-redux'
import { connect } from 'react-redux'
import type { Dispatch } from 'redux'

import { navigationManager } from '../Api/NavigationManager'
import { SUBSCRIBERS_KEY } from '../Model'
import { type RootStateFragment } from '../Model/Types'

type Props = {
  dispatch: NavigationDispatch,
  state: NavigationState,
  // screenProps?: Record<string, never>,
}

export const connectConditionalNavigation = (navigator: NavigationContainer): ConnectedComponent<
React.ComponentType<Props>,
Record<string, never>
> => {
  const ReduxNavigator = createReduxContainer(navigator, SUBSCRIBERS_KEY)

  const mapStateToProps = (state: RootStateFragment): { state: NavigationState } => ({ state: state.navigation })
  const mapDispatchToProps = (dispatch: Dispatch): { dispatch: Dispatch } => {
    navigationManager._setDispatch(dispatch)
    return { dispatch }
  }
  return connect(mapStateToProps, mapDispatchToProps)(ReduxNavigator)
}
