/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2020-06-26T18:06:72+02:00
 * @Copyright: Technology Studio
**/

import type { NavigationScreenConfig } from 'react-navigation'

type NavigationWithIsInitialState = Record<string, unknown> & {
  state: Record<string, unknown> & {
    isInitial: boolean,
  },
}

export const isInitialNavigationOptions = <OPTIONS extends Record<string, unknown>, NAVIGATION extends NavigationWithIsInitialState>(navigationOptions: NavigationScreenConfig<OPTIONS, NAVIGATION>): NavigationScreenConfig<OPTIONS, NAVIGATION> => (params) => {
  switch (typeof navigationOptions) {
    case 'function': return {
      ...navigationOptions(params),
      gesturesEnabled: !params.navigation.state.isInitial,
    }
    default: return {
      ...navigationOptions,
      gesturesEnabled: !params.navigation.state.isInitial,
    }
  }
}
