/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2017-06-12T19:56:34+02:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import type { Dispatch } from 'redux'

import { creators } from '../Redux/NavigationRedux'
import type {
  BackPayload,
  NavigatePayload,
  FinishFlowAndContinuePayload,
  RequireConditionsPayload,
  SetParamsPayload,
  NavigationAction,
} from '../Redux/Types/NavigationReduxTypes'

class NavigationManager {
  _dispatch: Dispatch | null
  creators = creators

  constructor () {
    this._dispatch = null
  }

  _setDispatch (dispatch: Dispatch): void {
    this._dispatch = dispatch
  }

  _getDispatch (): Dispatch {
    if (this._dispatch) {
      return this._dispatch
    }
    throw Error('dispatch is not set, setup navigation controller in root container')
  }

  // ATOMIC

  dispatchAction <ACTION extends {
    type: string,
  }> (
    action: ACTION,
    promiseCallbacks?: { resolve: () => void, reject: () => void },
  ): void {
    const dispatch = this._getDispatch()
    dispatch({
      ...action,
      promiseCallbacks,
    })
  }

  // TODO: promise not implemented yet
  navigate (payload: NavigatePayload): void {
    return this.dispatchAction(creators.navigate(payload))
  }

  // TODO: promise not implemented yet
  back (payload?: BackPayload): void {
    return this.dispatchAction(creators.back(payload))
  }

  // TODO: promise not implemented yet
  setParams (payload: SetParamsPayload): void {
    return this.dispatchAction(creators.setParams(payload))
  }

  // TODO: promise not implemented yet
  dispatchNavigationAction (navigationAction: NavigationAction): void {
    return this.dispatchAction(navigationAction)
  }

  // TODO: promise not implemented yet
  // TODO: in case of conditional navigation sequence should be postponed currently given sequence is executed as autonome actions
  all (navigationActionList: NavigationAction[]): void {
    return this.dispatchAction(creators.all(navigationActionList))
  }

  // TODO: promise not implemented yet
  cancelFlow (): void {
    return this.dispatchAction(creators.cancelFlow())
  }

  // TODO: promise not implemented yet
  finishFlowAndContinue (payload?: FinishFlowAndContinuePayload): void {
    return this.dispatchAction(creators.finishFlowAndContinue(payload))
  }

  // TODO: promise not implemented yet
  requireConditions (payload: RequireConditionsPayload): void {
    return this.dispatchAction(creators.requireConditions(payload))
  }

  // TODO: promise not implemented yet
  validateConditions (): void {
    return this.dispatchAction(creators.validateConditions())
  }

  // COMPOSITE
  // TODO: promise not implemented yet
  backAndNavigate (payload: {
    back?: BackPayload,
    navigate: NavigatePayload,
  }): void {
    return this.all([
      creators.back(payload.back),
      creators.navigate(payload.navigate),
    ])
  }

  // TODO: promise not implemented yet
  backAndSetParams (payload: {
    back?: BackPayload,
    setParams: SetParamsPayload,
  }): void {
    return this.all([
      creators.back(payload.back),
      creators.setParams(payload.setParams),
    ])
  }
}

export const navigationManager = new NavigationManager()
