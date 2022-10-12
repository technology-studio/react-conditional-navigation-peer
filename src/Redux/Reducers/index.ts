/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-01-12T13:23:03+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import { backReducer } from './BackReducer'
import { navigateReducer } from './NavigateReducer'
import { setParamsReducer } from './SetParamsReducer'
import {
  cancelFlowReducer,
  finishFlowAndContinueReducer,
} from './FlowReducer'
import { validateConditionsReducer } from './ValidateConditionsReducer'
import { requireConditionsReducer } from './RequireConditionsReducer'
import { allReducer } from './AllReducer'

export {
  backReducer,
  navigateReducer,
  setParamsReducer,
  cancelFlowReducer,
  finishFlowAndContinueReducer,
  validateConditionsReducer,
  requireConditionsReducer,
  allReducer,
}
