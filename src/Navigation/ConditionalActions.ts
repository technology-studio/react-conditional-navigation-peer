/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-04T14:11:71+01:00
 * @Copyright: Technology Studio
**/

import type {
  Condition,
  NavigationAction,
} from '../Model/Types'

export const ConditionalActions = {
  cancelFlow: (): NavigationAction => ({
    type: 'CANCEL_FLOW',
  }),
  finishFlowAndContinue: (): NavigationAction => ({
    type: 'FINISH_FLOW_AND_CONTINUE',
  }),
  requireConditions: (conditionList?: Condition[]): NavigationAction => ({
    type: 'REQUIRE_CONDITIONS',
    conditionList,
  }),
  validateConditions: (): NavigationAction => ({
    type: 'VALIDATE_CONDITIONS',
  }),
}
