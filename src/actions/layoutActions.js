import _ from 'lodash';
import { LAYOUT_GRAPH_DBL_TREE, LAYOUT_GRAPH_FORCE, LAYOUT_EDGE_CURVED } from './types';

export function useCurvedEdges() {
  return function(dispatch) {
    dispatch({
      type: LAYOUT_EDGE_CURVED,
      payload: true,
    });
  };
}

export function useStraightEdges() {
  return function(dispatch) {
    dispatch({
      type: LAYOUT_EDGE_CURVED,
      payload: false,
    });
  };
}

export function layoutAsDoubleTree(centerNodes) {
  const uniqueCenterNodes = _.uniqBy(centerNodes, 'id');
  return function(dispatch) {
    dispatch({
      type: LAYOUT_GRAPH_DBL_TREE,
      payload: uniqueCenterNodes,
    });
  };
}

export function layoutWithForce() {
  return function(dispatch) {
    dispatch({
      type: LAYOUT_GRAPH_FORCE,
      payload: {},
    });
  };
}
