import {
  SIDEBAR_SHOW_INFO,
  SIDEBAR_SHOW_FILTER,
  SIDEBAR_SHOW_SEARCH,
  SIDEBAR_SHOW_GRAPH,
} from './types';

export function showNodeInfo(node) {
  return function(dispatch) {
    dispatch({
      type: SIDEBAR_SHOW_INFO,
      payload: { obj: node, type: 'node' },
    });
  };
}

export function showLinkInfo(link) {
  return function(dispatch) {
    dispatch({
      type: SIDEBAR_SHOW_INFO,
      payload: { obj: link, type: 'link' },
    });
  };
}

export function sidebarShowFilter() {
  return function(dispatch) {
    dispatch({
      type: SIDEBAR_SHOW_FILTER,
      payload: {},
    });
  };
}

export function sidebarShow(type) {
  let reducerType = '';
  switch (type) {
    case 'filter':
      reducerType = SIDEBAR_SHOW_FILTER;
      break;
    case 'info':
      reducerType = SIDEBAR_SHOW_INFO;
      break;
    case 'search':
      reducerType = SIDEBAR_SHOW_SEARCH;
      break;
    case 'graph':
      reducerType = SIDEBAR_SHOW_GRAPH;
      break;
    default:
      reducerType = SIDEBAR_SHOW_SEARCH;
  }

  return function(dispatch) {
    dispatch({
      type: reducerType,
      payload: {},
    });
  };
}
