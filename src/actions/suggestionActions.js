import { SUGGESTION_ADD_NODE, SUGGESTION_ADD_LINK, SUGGESTION_CHANGE_NODE, SUGGESTION_TMP_CHANGE_NODE, SUGGESTION_REMOVE_NODE } from "./types";

export function addNode(type, name) {
  return function (dispatch, getState) {
    dispatch({
      type: SUGGESTION_ADD_NODE,
      payload: { type, name, id: Math.random() }
    });
  }
}

export function removeNode(id) {
  return function (dispatch, getState) {
    dispatch({
      type: SUGGESTION_REMOVE_NODE,
      payload: id
    });
  }
}

export function changeNode(id, props) {
  console.log('change');
  return function (dispatch, getState) {
    dispatch({
      type: SUGGESTION_CHANGE_NODE,
      payload: { id, props }
    });
  }
}

export function changeNodeTmp(id, props) {
  console.log('tmp');
  return function (dispatch, getState) {
    dispatch({
      type: SUGGESTION_TMP_CHANGE_NODE,
      payload: { id, props }
    });
  }
}

export function addLink(type, node1, node2) {
  return function (dispatch, getState) {
    console.log('add suggestion', type, node1, node2);
    dispatch({
      type: SUGGESTION_ADD_LINK,
      payload: { type, sourceId: node1, targetId: node2, id: Math.random() }
    });
  }
}