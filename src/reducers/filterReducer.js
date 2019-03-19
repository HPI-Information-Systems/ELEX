import {
    FILTER_CHANGE_RANGE,
    FILTER_HIDE_UNCONNECTED,
    FILTER_LINK_TYPE,
    FILTER_NODE_TYPE,
    FILTER_REMOVE_LEGEND
} from "../actions/types";

const INITIAL_STATE = { nodeTypes: [], linkTypes: [], rangeFilter: [] };

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case FILTER_REMOVE_LEGEND:
            return { ...state, nodeTypes: [], linkTypes: [] };

        case FILTER_NODE_TYPE:
            const nodeTypes = state.nodeTypes;
            nodeTypes[action.payload] = !nodeTypes[action.payload];

            return { ...state, nodeTypes: nodeTypes };

        case FILTER_LINK_TYPE:
            const linkTypes = state.linkTypes;
            linkTypes[action.payload] = !linkTypes[action.payload];

            return { ...state, linkTypes: linkTypes };

        case FILTER_CHANGE_RANGE:
            return { ...state, rangeFilter: action.payload };

        case FILTER_HIDE_UNCONNECTED:
            return { ...state, hideUnconnected: action.payload };

        default:
            return state;
    }
}