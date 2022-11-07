/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2017-06-14T17:58:32+02:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
**/

import { Log } from '@txo/log'
import type { DefaultRootState } from '@txo-peer-dep/redux'

import { configManager } from '../Config'
import type { Condition } from '../Model/Types'
import type {
  NavigationAction,
  ResolveConditionsResult,
} from '../Redux/Types/NavigationReduxTypes'

const log = new Log('txo.react-conditional-navigation.Api.ConditionalNavigationManager')

export type ResolveCondition<CONDITION extends Condition, ROOT_STATE extends DefaultRootState['navigation']> = (
  condition: CONDITION,
  navigationAction: NavigationAction,
  rootState: ROOT_STATE,
) => NavigationAction | undefined

class ConditionalNavigationManager<CONDITION extends Condition, ROOT_STATE extends DefaultRootState['navigation']> {
  _conditionToResolveCondition: Record<string, ResolveCondition<CONDITION, ROOT_STATE>>
  _logicalClock = 0

  constructor () {
    this._conditionToResolveCondition = {}
  }

  resolveConditions (conditionList: CONDITION[], navigationAction: NavigationAction, rootState: ROOT_STATE): ResolveConditionsResult<ROOT_STATE> | undefined {
    if (!configManager.config.ignoreConditionalNavigation) {
      log.debug('RESOLVE CONDITIONS', { conditionList, navigationAction })
      for (const condition of conditionList) {
        const resolveCondition: ResolveCondition<CONDITION, ROOT_STATE> = this._conditionToResolveCondition[condition.key]
        if (resolveCondition) {
          const newNavigationAction: NavigationAction | undefined = resolveCondition(condition, navigationAction, rootState)
          if (newNavigationAction) {
            log.debug('NEW NAVIGATION ACTION', { preview: condition.key, newNavigationAction, navigationAction })
            return {
              navigationAction: {
                // NOTE: spread previous navigation action to keep react-navigation specific properties (e.g. source, target)
                ...navigationAction,
                params: undefined,
                ...newNavigationAction,
              },
              conditionalNavigationState: {
                condition,
                postponedAction: navigationAction,
                logicalTimestamp: this.getAndIncrementLogicalClock(),
                previousState: JSON.parse(JSON.stringify(rootState)),
              },
            }
          }
        }
      }
    }
  }

  registerResolveCondition (conditionKey: string, resolveCondition: ResolveCondition<CONDITION, ROOT_STATE>): () => void {
    this._conditionToResolveCondition[conditionKey] = resolveCondition
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- TODO: check if this is correct
    return () => { delete this._conditionToResolveCondition[conditionKey] }
  }

  getAndIncrementLogicalClock (): number {
    return ++this._logicalClock
  }
}

export const conditionalNavigationManager = new ConditionalNavigationManager<Condition, DefaultRootState['navigation']>()

export const registerResolveCondition = (
  conditionKey: string,
  resolveCondition: ResolveCondition<Condition, DefaultRootState['navigation']>,
): () => void => conditionalNavigationManager.registerResolveCondition(conditionKey, resolveCondition)
