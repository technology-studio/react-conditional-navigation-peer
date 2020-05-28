/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2017-11-08T20:38:35+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import type { NavigationState } from 'react-navigation'

export type State = NavigationState

export type RootStateFragment = {
  navigation: ?State,
}
