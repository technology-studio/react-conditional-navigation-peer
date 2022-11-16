/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-08T08:11:68+01:00
 * @Copyright: Technology Studio
**/

import { conditionalNavigationManager } from '../Api/ConditionalNavigationManager'
import { getActiveLeafNavigationNode } from '../Api/NavigationUtils'
import type { OnActionAttributes } from '../Model/Types'

export const onRequireConditionsAction = ({
  action,
  getState,
  nextOnAction,
  restArgs,
}: OnActionAttributes): boolean => {
  const { conditionList, promiseCallbacks } = action
  const state = getState()
  if (conditionList) {
    const resolveConditionsResult = conditionalNavigationManager.resolveConditions(conditionList, action, state)
    if (resolveConditionsResult && state) {
      const activeLeafNavigationNode = getActiveLeafNavigationNode(state)
      activeLeafNavigationNode.conditionalNavigation = resolveConditionsResult.conditionalNavigationState
      return nextOnAction(resolveConditionsResult.navigationAction, ...restArgs)
    }
  }
  promiseCallbacks?.resolve()
  return true
}
