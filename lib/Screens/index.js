/**
 * @Author: Erik Slovák <erik>
 * @Date:   2017-11-20T09:55:33+01:00
 * @Email:  erik.slovak@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import * as _PropTypes from 'prop-types'
import type { NavigationProps } from './Types'

export const PropTypes = {
  navigationParamsShape: (params: any) => _PropTypes.shape({
    state: _PropTypes.shape({
      params: _PropTypes.shape(params),
    }),
  }),
}

export const navigationParams = <PARAMS: Object>(props: NavigationProps<PARAMS, *, *>): PARAMS => props.navigation.state.params || {}
