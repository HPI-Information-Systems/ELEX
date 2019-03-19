import { API_FETCH_GRAPH, API_FETCH_SUGGESTIONS } from '../types';
import _ from 'lodash';

export default {
  getNNodes: (dispatch, state, count) => {
    console.log(`get ${count} nodes`);
    const gNodes = state.graphml.nodes;
    const gLinks = state.graphml.links;
    const nodes = [];
    const links = [];
    if (count === 'all') {
      let keys = Object.keys(gNodes);
      for (const key in keys) {
        if (keys.hasOwnProperty(key)) {
          nodes.push(gNodes[keys[key]]);
        }
      }
      keys = Object.keys(gLinks);
      for (const key in keys) {
        if (keys.hasOwnProperty(key)) {
          links.push(gLinks[keys[key]]);
        }
      }
    }

    console.log(nodes, links);

    // to ensure that all other functions (like clearGraph) are already executed
    setTimeout(function() {
      dispatch({
        type: API_FETCH_GRAPH,
        payload: { nodes, links },
      });
    }, 100);
  },

  genNNodes: (dispatch, state, count) => {
    console.log(`gen ${count} nodes`);
    const nodes = [];
    const links = [];
    const colors = getRandomColors();
    // const colors = getRiskColors();
    // Generate a random graph:
    for (let i = 0; i < count; i++)
      nodes.push({
        id: `n${i}`,
        x: Math.random(),
        y: Math.random(),
        props: {
          name: `Node ${i}`,
          __color: colors[Math.floor(Math.random() * colors.length)],
          __radius: Math.random() * 15 + 15,
        },
        type: 'Node',
      });

    for (let i = 0; i < count * 3; i++)
      links.push({
        id: 'e' + i,
        sourceId: 'n' + ((Math.random() * count) | 0),
        targetId: 'n' + ((Math.random() * count) | 0),
        props: {
          // risk: Math.random(),
          __weight: Math.random() * 4,
          __color: '#ccc',
        },
        type: 'Relation',
      });

    setTimeout(function() {
      dispatch({
        type: API_FETCH_GRAPH,
        payload: { nodes, links },
      });
    }, 100);
  },

  fetchSuggestions(dispatch, state, search) {
    const searchKey = search;
    const gNodes = state.graphml.nodes;
    const gLinks = state.graphml.links;
    const suggestions = [];
    search = search.toLowerCase();

    for (let i in gNodes) {
      if (gNodes.hasOwnProperty(i)) {
        let node = gNodes[i];
        try {
          if (
            node['name']
              .toString()
              .toLowerCase()
              .startsWith(search)
          ) {
            suggestions.push({ name: node['name'], id: node.id, type: node.type });
          }
        } catch (err) {
          // console.log(err);
        }
        try {
          if (
            node.props['name']
              .toString()
              .toLowerCase()
              .startsWith(search)
          ) {
            suggestions.push({ name: node.props['name'], id: node.id, type: node.type });
          }
        } catch (err) {
          // console.log(err);
        }
      }
    }

    if (search === 'all') {
      suggestions.push({ name: 'Get all nodes', id: '-1', type: 'count', query: search });
    }

    if (search.startsWith('elex:gen')) {
      suggestions.push({
        name: `Generate ${search.substring(8)} nodes`,
        id: '-1',
        type: 'gen',
        query: search,
      });
    }

    // fetch suggestions from graphML
    suggestions.searchKey = searchKey;
    setTimeout(function() {
      dispatch({
        type: API_FETCH_SUGGESTIONS,
        payload: suggestions,
      });
    }, 10);
  },

  fetchNeighbours: (dispatch, state, id, depth) => {
    const gNodes = state.graphml.nodes;
    const gLinks = state.graphml.links;

    let nodes = [];
    let links = [];
    const root = gNodes[id];

    nodes.push(root);
    root.neighbours.every(function(id) {
      nodes.push(gNodes[id]);
      return true;
    });

    root.edges.every(function(edge) {
      links.push(edge);
      return true;
    });

    nodes = _.uniqBy(nodes, 'id');
    links = _.uniqBy(links, 'id');

    const graph = { nodes, links, searchId: id };

    // to ensure that all other functions (like clearGraph) are already executed
    setTimeout(function() {
      dispatch({
        type: API_FETCH_GRAPH,
        payload: graph,
      });
    }, 100);
  },
};

function getRandomColors() {
  return [
    '#965E04',
    '#C89435',
    '#F7A456',
    '#AFCF8A',
    '#7B39DE',
    '#B095C0',
    '#D24556',
    '#93C2FA',
    '#9DB09E',
    '#F8C821',
  ];
}

function getRiskColors() {
  function interpolate(n) {
    let R = (205 * n) / 100;
    let G = (205 * (100 - n)) / 100;
    let B = 0;

    let rString = Math.ceil(R).toString(16);
    let gString = Math.ceil(G).toString(16);

    if (rString.length < 2) rString = '0' + rString;
    if (gString.length < 2) gString = '0' + gString;

    return `#${rString}${gString}00`;
  }

  // const from = '#119900';
  // const to = '#CC0000';

  const colors = [];

  for (let i = 0; i < 100; i++) {
    colors.push(interpolate(i));
  }

  console.log(colors);

  return colors;
}
