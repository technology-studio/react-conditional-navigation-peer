/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2017-06-14T17:58:32+02:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import { Log } from '@txo/log'
import type { LiteralMap } from '@txo/flow'

import { configManager } from '../Config'
import type { Condition } from '../Model/Types'

import type {
  NavigationAction,
  ResolveConditionsResult,
} from '../Redux/Types/NavigationReduxTypes'

const log = new Log('txo.react-conditional-navigation.Api.ConditionalNavigationManager')

export type ResolveCondition<+CONDITION: Condition, ROOT_STATE> = (
  condition: $ReadOnly<CONDITION>,
  navigationAction: NavigationAction,
  rootState: ROOT_STATE,
) => ? NavigationAction

class ConditionalNavigationManager {
  _conditionToResolveCondition: LiteralMap<string, ResolveCondition<*, any>>

  constructor () {
    this._conditionToResolveCondition = {}
  }

  resolveConditions (conditionList: Condition[], navigationAction: NavigationAction, rootState: *): ?ResolveConditionsResult {
    if (!configManager.config.ignoreConditionalNavigation) {
      log.debug('RESOLVE CONDITIONS', { conditionList, navigationAction })
      for (const condition: Condition of conditionList) {
        const resolveCondition: ResolveCondition<*, any> = this._conditionToResolveCondition[condition.key]
        if (resolveCondition) {
          const newNavigationAction: ?NavigationAction = resolveCondition(condition, navigationAction, rootState)
          if (newNavigationAction) {
            log.debug('NEW NAVIGATION ACTION', { preview: condition.key, newNavigationAction })
            return {
              navigationAction: newNavigationAction,
              conditionalNavigationState: {
                condition: condition,
                postponedAction: navigationAction,
              },
            }
          }
        }
      }
    }
  }

  registerResolveCondition <CONDITION: Condition, ROOT_STATE_FRAGMENT> (conditionKey: string, resolveCondition: ResolveCondition<CONDITION, ROOT_STATE_FRAGMENT>) {
    this._conditionToResolveCondition[conditionKey] = resolveCondition
    return () => { delete this._conditionToResolveCondition[conditionKey] }
  }
}

export const conditionalNavigationManager = new ConditionalNavigationManager()

export const registerResolveCondition = <CONDITION: Condition, ROOT_STATE_FRAGMENT>(
  conditionKey: string,
  resolveCondition: ResolveCondition<CONDITION, ROOT_STATE_FRAGMENT>,
) => conditionalNavigationManager.registerResolveCondition(conditionKey, resolveCondition)
