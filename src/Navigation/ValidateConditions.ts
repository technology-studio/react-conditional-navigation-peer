/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-08T08:11:68+01:00
 * @Copyright: Technology Studio
**/

import { conditionalNavigationManager } from '../Api/ConditionalNavigationManager'
import {
  getActiveLeafNavigationNode,
  getActiveScreenPath,
  getNavigationPathFromAction,
} from '../Api/NavigationUtils'
import type {
  OnActionAttributes,
  Condition,
} from '../Model/Types'

export const validateConditionsActionCreator = ({
  action,
  getState,
  originalOnAction,
  restArgs,
  screenConditionsMap,
}: OnActionAttributes): boolean => {
  const state = getState()
  const currentActiveScreenPath = getActiveScreenPath(state)
  const desiredScreenPath = [
    ...currentActiveScreenPath ?? [],
    ...getNavigationPathFromAction(action) ?? [],
  ]
  const conditionList = desiredScreenPath?.reduce<Condition[] | undefined>((conditions, screenName) => {
    const screenConditions = screenConditionsMap[screenName]
    return screenConditions?.length > 0 && !conditions
      ? screenConditions
      : conditions
  }, undefined)
  if (conditionList) {
    const resolveConditionsResult = conditionalNavigationManager.resolveConditions(conditionList, action, state)
    if (resolveConditionsResult && state) {
      const activeLeafNavigationNode = getActiveLeafNavigationNode(state)
      activeLeafNavigationNode.conditionalNavigation = resolveConditionsResult.conditionalNavigationState
      return originalOnAction(resolveConditionsResult.navigationAction, ...restArgs)
    }
  }
  return true
}
