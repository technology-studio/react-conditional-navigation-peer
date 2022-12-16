/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2022-11-04T14:11:71+01:00
 * @Copyright: Technology Studio
**/

import type { NavigationAction } from '@react-navigation/native'

export const ConditionalActions = {
  cancelFlow: (): NavigationAction => ({
    type: 'CANCEL_FLOW',
  }),
  finishFlowAndContinue: (): NavigationAction => ({
    type: 'FINISH_FLOW_AND_CONTINUE',
  }),
}
