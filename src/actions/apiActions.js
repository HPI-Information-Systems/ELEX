import { API_FETCH_GRAPH, API_SET_LINK_TYPES, API_SET_NODE_TYPES } from './types';
import online from './api/onlineApiActions';
import offline from './api/offlineApiActions';

/**
 * @param state {object} - state from dispatch
 * @return {boolean} return true if is in offline mode; false otherwise
 * */
function isOnline(state) {
  return !state.graphml.nodes;
}

function defaultDispatch(dispatch) {
  dispatch({ type: '', payload: {} });
}

export function sendFeedback(type, user, props) {
  return function(dispatch, getState) {
    // if (isOnline(getState())) {
    //     online.sendFeedback({type, user, props});
    // } else {
    //     defaultDispatch(dispatch);
    // }

    online.sendFeedback(dispatch, { type, user, props });
  };
}

export function clearGraph() {
  return function(dispatch) {
    console.log(`clear graph`);
    dispatch({
      type: API_FETCH_GRAPH,
      payload: { nodes: [], links: [] },
    });
  };
}

export function fetchMeta() {
  return function(dispatch, getState) {
    console.log(`online: ${isOnline(getState())}`);

    if (isOnline(getState())) {
      online.fetchMeta(dispatch);
    } else {
      defaultDispatch(dispatch);
    }
  };
}

function fetchDetails(id, type) {
  return function(dispatch, getState) {
    if (isOnline(getState())) {
      online.fetchDetails(dispatch, id, type);
    } else {
      defaultDispatch(dispatch);
    }
  };
}

export function fetchLinkDetails(id) {
  return fetchDetails(id, 'link');
}

export function fetchNodeDetails(id) {
  return fetchDetails(id, 'node');
}

export function setNodeTypes(nodeTypes) {
  return function(dispatch) {
    console.log(nodeTypes);
    dispatch({
      type: API_SET_NODE_TYPES,
      payload: nodeTypes,
    });
  };
}

export function setLinkTypes(linkTypes) {
  return function(dispatch) {
    dispatch({
      type: API_SET_LINK_TYPES,
      payload: linkTypes,
    });
  };
}

export function fireCypherRequest(cypherQuery) {
  return function(dispatch, getState) {
    if (isOnline(getState())) {
      online.fireCleLRequest(dispatch, cypherQuery);
    } else {
      defaultDispatch(dispatch);
    }
  };
}

export function getNNodes(count) {
  return function(dispatch, getState) {
    console.log('get');
    if (isOnline(getState())) {
      online.getNNodes(dispatch, count);
    } else {
      offline.getNNodes(dispatch, getState(), count);
    }
  };
}

export function genNNodes(count) {
  return function(dispatch, getState) {
    console.log('gen');
    offline.genNNodes(dispatch, getState(), count);
  };
}

export function fetchSuggestions(search) {
  return function(dispatch, getState) {
    if (isOnline(getState())) {
      online.fetchSuggestions(dispatch, getState(), search);
    } else {
      offline.fetchSuggestions(dispatch, getState(), search);
    }
  };
}

export function fetchNeighbours(id, depth = 1) {
  return function(dispatch, getState) {
    if (isOnline(getState())) {
      online.fetchNeighbours(dispatch, getState(), id, depth);
    } else {
      offline.fetchNeighbours(dispatch, getState(), id, depth);
    }
  };
}
