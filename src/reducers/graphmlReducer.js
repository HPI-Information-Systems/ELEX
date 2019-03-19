import { API_SET_GRAPHML } from "../actions/types";

const INITIAL_STATE = { nodes: [], links: [] };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case API_SET_GRAPHML:
      return { ...state, nodes: action.payload.nodes, links: action.payload.links };
  }
  return state;
}