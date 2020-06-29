/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2020-06-26T18:06:72+02:00
 * @Copyright: Technology Studio
 * @flow
**/

import type { NavigationScreenConfig } from 'react-navigation'

export const isInitialNavigationOptions = <OPTIONS: Object>(navigationOptions: NavigationScreenConfig<OPTIONS>): NavigationScreenConfig<OPTIONS> => (params) => {
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
