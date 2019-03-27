import { LAYOUT_EDGE_CURVED, LAYOUT_GRAPH_DBL_TREE, LAYOUT_GRAPH_FORCE } from '../actions/types';

const INITIAL_STATE = {
  centerNodes: [],
  useCurvedEdges: true,
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LAYOUT_EDGE_CURVED:
      return { ...state, useCurvedEdges: action.payload };
    case LAYOUT_GRAPH_FORCE:
      return { ...state, type: 'force', centerNodes: [] };
    case LAYOUT_GRAPH_DBL_TREE:
      return { ...state, type: 'dbltree', centerNodes: action.payload };
    default:
      return state;
  }
}
