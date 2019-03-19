import {
  FILTER_NODE_TYPE,
  FILTER_LINK_TYPE,
  FILTER_CHANGE_RANGE,
  FILTER_HIDE_UNCONNECTED,
  FILTER_REMOVE_LEGEND,
} from './types';

export function changeRangeFilters(rangeFilter) {
  return function(dispatch) {
    dispatch({
      type: FILTER_CHANGE_RANGE,
      payload: rangeFilter,
    });
  };
}

export function hideUnconnected(bool) {
  return function(dispatch) {
    dispatch({
      type: FILTER_HIDE_UNCONNECTED,
      payload: bool,
    });
  };
}

export function removeLegendFilter() {
  return function(dispatch) {
    dispatch({
      type: FILTER_REMOVE_LEGEND,
      payload: {},
    });
  };
}

export function filterVertexType(type) {
  return function(dispatch) {
    dispatch({
      type: FILTER_NODE_TYPE,
      payload: type,
    });
  };
}

export function filterEdgeType(type) {
  return function(dispatch) {
    dispatch({
      type: FILTER_LINK_TYPE,
      payload: type,
    });
  };
}
