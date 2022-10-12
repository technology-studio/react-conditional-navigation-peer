/**
 * @Author: Erik Slovák <erik>
 * @Date:   2017-11-20T09:55:33+01:00
 * @Email:  erik.slovak@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import type { NavigationProps } from './Types'

export const navigationParams = <
PARAMS extends Record<string, unknown>,
OPTIONS extends Record<string, unknown> = Record<string, never>,
SCREEN_PROPS extends Record<string, unknown> = Record<string, never>
>(props: NavigationProps<PARAMS, OPTIONS, SCREEN_PROPS>): PARAMS => props.navigation.state.params || {}
