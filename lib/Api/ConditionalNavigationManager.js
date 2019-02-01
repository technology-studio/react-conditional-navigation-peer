/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2017-06-14T17:58:32+02:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import { Log } from '@txo-peer-dep/log'
import type { LiteralMap } from '@txo/flow'

import { configManager } from '../Config'
import type { Condition } from '../Model/Types'

import type {
  NavigationAction,
  ResolveConditionsResult,
} from '../Redux/Types/NavigationReduxTypes'

const log = new Log('txo.react-conditional-navigation.Api.ConditionalNavigationManager')

export class ConditionalNavigationResolver<CONDITION: Condition> {
  resolveCondition (condition: CONDITION, navigationAction: NavigationAction): ?NavigationAction {
  }
}

class ConditionalNavigationManager {
  _conditionToConditionalNavigationResolvers: LiteralMap<string, ConditionalNavigationResolver<*>>

  constructor () {
    this._conditionToConditionalNavigationResolvers = {}
  }

  resolveConditions (conditionList: Condition[], navigationAction: NavigationAction): ?ResolveConditionsResult {
    if (!configManager.config.ignoreConditionalNavigation) {
      log.debug('RESOLVE CONDITIONS', { conditionList, navigationAction })
      for (const condition: Condition of conditionList) {
        const conditionalNavigationResolver: ConditionalNavigationResolver<*> = this._conditionToConditionalNavigationResolvers[condition.key]
        if (conditionalNavigationResolver instanceof ConditionalNavigationResolver) {
          const newNavigationAction: ?NavigationAction = conditionalNavigationResolver.resolveCondition(condition, navigationAction)
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

  registerConditionalNavigationResolver (condition: string, conditionalNavigationResolver: ConditionalNavigationResolver<*>) {
    this._conditionToConditionalNavigationResolvers[condition] = conditionalNavigationResolver
    return () => { delete this._conditionToConditionalNavigationResolvers[condition] }
  }
}

export const conditionalNavigationManager = new ConditionalNavigationManager()
