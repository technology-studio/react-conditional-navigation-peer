/**
 * @Author: Erik Slovák <erik>
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2017-11-20T09:54:26+01:00
 * @Email:  erik.slovak@technologystudio.sk
 * @Copyright: Technology Studio
**/

import type {
  NavigationScreenProp,
  NavigationRoute,
} from 'react-navigation'

export type NavigationProps<
PARAMS extends Record<string, unknown>,
OPTIONS extends Record<string, unknown> = Record<string, never>,
SCREEN_PROPS extends Record<string, unknown> = Record<string, never>
> = {
  navigation: NavigationScreenProp<{ params: PARAMS } & NavigationRoute>,
  screenProps?: SCREEN_PROPS,
  navigationOptions?: OPTIONS,
}
