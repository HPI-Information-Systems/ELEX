import { EVENT_CLICK_NODE, EVENT_CLICK_SVG, EVENT_SELECTED_NODES, EVENT_NEW_GRAPH } from "./types";

export function callNewGraphEvent(graph) {
  return function (dispatch) {
    dispatch({
      type: EVENT_NEW_GRAPH,
      payload: graph
    });
  }
}

export function callSelectedNodesEvent(nodes) {
  return function (dispatch) {
    dispatch({
      type: EVENT_SELECTED_NODES,
      payload: nodes
    });
  }
}

export function callNodeClickEvent(node) {
  return function (dispatch) {
    dispatch({
      type: EVENT_CLICK_NODE,
      payload: node
    });
  }
}

export function callSvgClickEvent(pos) {
  return function (dispatch) {
    dispatch({
      type: EVENT_CLICK_SVG,
      payload: pos
    });
  }
}

