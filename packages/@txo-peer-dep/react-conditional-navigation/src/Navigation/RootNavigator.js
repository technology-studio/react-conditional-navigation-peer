/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2017-11-05T19:13:46+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import * as React from 'react' // eslint-disable-line no-unused-vars
import type {
  NavigationState,
  NavigationDispatch,
} from 'react-navigation'
import { createReduxContainer } from 'react-navigation-redux-helpers'
import { connect } from 'react-redux'

import { navigationManager } from '../Api/NavigationManager'
import { SUBSCRIBERS_KEY } from '../Model'
import { type RootStateFragment } from '../Model/Types'

type Props = {
  dispatch: NavigationDispatch,
  state: NavigationState,
  screenProps?: {},
}

export const connectConditionalNavigation = (Navigator: *) => {
  const ReduxNavigator = createReduxContainer(Navigator, SUBSCRIBERS_KEY)

  const mapStateToProps = (state: RootStateFragment) => ({ state: state.navigation })
  const mapDispatchToProps = (dispatch: *) => {
    navigationManager._setDispatch(dispatch)
    return { dispatch }
  }
  return connect<Props, *, _, _, _, _>(mapStateToProps, mapDispatchToProps)(ReduxNavigator)
}
