import {
    API_FETCH_SUGGESTIONS, API_FETCH_GRAPH, API_FETCH_META, API_SET_NODE_TYPES,
    API_SET_LINK_TYPES, API_FETCH_DETAILS
} from "../actions/types";

const INITIAL_STATE = {
    suggestions: [],
    graph: { nodes: [], links: [], searchId: null },
    requestParams: { nodeTypes: [], linkTypes: [] },
    details: { page: "", id: "", type: "" }
};

export default function(state = INITIAL_STATE, action) {
    const requestParams = state.requestParams;
    switch (action.type) {
        case API_FETCH_SUGGESTIONS:
            return { ...state, suggestions: action.payload };
        case API_FETCH_GRAPH:
            return { ...state, graph: action.payload };
        case API_FETCH_DETAILS:
            return { ...state, details: action.payload };
        case API_SET_NODE_TYPES:
            requestParams.nodeTypes = action.payload;
            return { ...state, requestParams };
        case API_FETCH_META:
            const nodeTypes = [];
            const linkTypes = [];

            if (action.payload.nodes)
                Object.keys(action.payload.nodes).forEach(key => {
                    if (action.payload.nodes.hasOwnProperty(key)) {
                        const node = action.payload.nodes[key];
                        if (node && node.type && node.explore) {
                            nodeTypes.push(node.type);
                        }
                    }
                });
            if (action.payload.links)
                Object.keys(action.payload.links).forEach(key => {
                    if (action.payload.links.hasOwnProperty(key)) {
                        const link = action.payload.links[key];
                        if (link && link.type && link.explore) {
                            linkTypes.push(link.type);
                        }
                    }
                });

            return { ...state, requestParams: { nodeTypes, linkTypes } };
        case API_SET_LINK_TYPES:
            requestParams.linkTypes = action.payload;
            return { ...state, requestParams };
    }
    return state;
}