/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2017-11-07T18:09:48+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import {
  createNavigationMiddleware,
  createNavigationReducer,
} from './NavigationRedux'
import { combineReducers } from './CombineReducers'

export {
  combineReducers,
  createNavigationMiddleware,
  createNavigationReducer,
}
