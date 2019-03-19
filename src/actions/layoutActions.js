import { LAYOUT_GRAPH_DBL_TREE, LAYOUT_GRAPH_FORCE } from "./types";
import _ from 'lodash';

export function layoutAsDoubleTree(centerNodes) {
  centerNodes = _.uniqBy(centerNodes, 'id');
  console.log(centerNodes);
  return function (dispatch) {
    dispatch({
      type: LAYOUT_GRAPH_DBL_TREE,
      payload: centerNodes
    });
  }
}

export function layoutWithForce() {
  return function (dispatch) {
    dispatch({
      type: LAYOUT_GRAPH_FORCE,
      payload: {}
    });
  }
}
