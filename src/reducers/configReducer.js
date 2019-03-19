import { API_FETCH_META, CONFIG } from '../actions/types';

const INITIAL_STATE = {
  typeToIcon: {
    actor: 'person',
    person: 'person',
    customer: 'person',
    movie: 'movie',
    product: 'redeem',
    country: 'language',
    organization: 'people',
    location: 'location_on',
    address: 'location_on',
    city: 'location_on',
    cypher: 'cloud_upload',
    company: 'location_city',
    business: 'location_city',
    boat: 'directions_boat',
    ship: 'directions_boat',
    vessel: 'directions_boat',
    order: 'directions_boat',
  },
  typeToName: { Movie: 'title' },
  meta: { nodes: [], links: [], nodeTypes: [], linkTypes: [] },
  getColor: function(type) {
    return '#000';
  },
  getLabelAttribute: function(type) {
    return 'name';
  },
};

// function getIcon return a specific icon for a type or the default 'brightness_1' circle
INITIAL_STATE.getIcon = function(type) {
  if (!type) return 'brightness_1';
  return INITIAL_STATE.typeToIcon[type.toLowerCase().replace(/\s+/g, '')] || 'brightness_1';
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CONFIG:
      return {
        state,
        getIcon: function(type) {
          return state.typeToIcon[type.toLowerCase().replace(/\s+/g, '')] || 'brightness_1';
        },
      };
    case API_FETCH_META:
      const nodes = action.payload.nodes;
      const links = action.payload.links;
      const nodeTypes = [];
      const linkTypes = [];

      // types
      if (nodes)
        Object.keys(nodes).forEach((key) => {
          if (nodes.hasOwnProperty(key)) {
            const node = nodes[key];
            if (node && node.type) {
              nodeTypes.push(node.type);
            }
          }
        });
      if (links)
        Object.keys(links).forEach((key) => {
          if (links.hasOwnProperty(key)) {
            const link = links[key];
            if (link && link.type) {
              linkTypes.push(link.type);
            }
          }
        });

      return {
        ...state,
        meta: { nodes, links, nodeTypes, linkTypes },
        getIcon: function(type) {
          return nodes[type].icon || 'brightness_1';
        },
        getColor: function(type) {
          return nodes[type].color || '#000';
        },
        getLabelAttribute: function(type) {
          return nodes[type].labelAttribute || 'name';
        },
      };
    default:
      return state;
  }
}
