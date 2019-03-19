import { API_SET_GRAPHML } from './types';
import _ from 'lodash';
import { notification } from 'antd';

export function useGraphMLAction(graphml) {
  try {
    const xml = parseXml(graphml);
    const json = xmlToJson(xml);
    const graph = loadAsGraph(json, graphmlJsonToGraph);
    notification.success({ message: 'The graph from the graphml is loaded!' });

    return function(dispatch) {
      dispatch({
        type: API_SET_GRAPHML,
        payload: graph,
      });
    };
  } catch (e) {
    notification.success({
      message: 'Something went wrong',
      description: 'Maybe the graphML is malformed.',
    });

    return function(dispatch) {
      dispatch({
        type: API_SET_GRAPHML,
        payload: { nodes: null, links: null },
      });
    };
  }
}

export function clearGraphMLAction(type) {
  return function(dispatch) {
    dispatch({
      type: API_SET_GRAPHML,
      payload: { nodes: null, links: null },
    });
  };
}

/**
 * @param json - json object of graph
 * @param nodeFct - callback for parsing nodes
 * @param linkFct - callback for parsing links
 * @param activeFct - position data
 * */
function graphmlJsonToGraph(json, nodeFct, linkFct, activeFct) {
  var graphml = json.graphml;
  var graph = graphml.graph;
  var keys = { edge: [], node: [] };
  var hlist = [];
  var hlist2 = [];
  var count;
  var attr = [];
  var attrShow = [];

  // parse keys
  if (graphml.key) {
    if (typeof graphml.key.push === 'undefined') {
      hlist = [graphml.key];
    } else {
      hlist = graphml.key;
    }
    hlist.every(function(k) {
      if (_.has(keys, k['@attributes'].for)) {
        keys[k['@attributes'].for][k['@attributes'].id] = k['@attributes']['attr.name'];
      }
      return true;
    });
  }

  // parse nodes
  if (graph.node) {
    if (typeof graph.node.push === 'undefined') {
      hlist = [graph.node];
    } else {
      hlist = graph.node;
    }
    hlist.every(function(node) {
      var n = { props: {}, type: 'Node', id: node['@attributes'].id };
      Object.keys(node['@attributes']).every(function(key) {
        n.props[key] = node['@attributes'][key];
        attr.push(key);
        attrShow.push(key);
        return true;
      });

      if (node.data) {
        if (typeof node.data.push === 'undefined') {
          hlist2 = [node.data];
        } else {
          hlist2 = node.data;
        }
        hlist2.every(function(at) {
          if (keys.node[at['@attributes'].key] === 'type') {
            n.type = at['#text'];
            // types.push(at['#text']);
            // types = _.uniq(types);
          } else {
            n.props[keys.node[at['@attributes'].key]] = at['#text'];
            attrShow.push(keys.node[at['@attributes'].key]);
          }
          return true;
        });
      }

      nodeFct(node['@attributes'].id, n);
      return true;
    });
  }

  // parse edges
  if (graph.edge) {
    count = 0;
    if (typeof graph.edge.push === 'undefined') {
      hlist = [graph.edge];
    } else {
      hlist = graph.edge;
    }
    hlist.every(function(edge) {
      var e = { id: count, type: 'Edge', props: {} };
      count++;
      Object.keys(edge['@attributes']).every(function(key) {
        e[key] = edge['@attributes'][key];
        return true;
      });

      if (edge.data) {
        if (typeof edge.data.push === 'undefined') {
          hlist2 = [edge.data];
        } else {
          hlist2 = edge.data;
        }
        hlist2.every(function(at) {
          if (keys.edge[at['@attributes'].key] === 'type') {
            e.type = at['#text'];
          } else {
            e.props[keys.edge[at['@attributes'].key]] = at['#text'];
          }
          return true;
        });
      }

      linkFct(edge['@attributes'].source + '->' + edge['@attributes'].target, e);
      return true;
    });
  }

  if (graph['active-data']) {
    console.log('this graph has active data');
    if (typeof graph['active-data'].push === 'undefined') {
      hlist = [graph['active-data']];
    } else {
      hlist = graph['active-data'];
    }
    hlist.every(function(activeData) {
      if (activeData['@attributes'].type === 'node') {
        activeFct(
          activeData['@attributes'].id,
          parseInt(activeData['@attributes'].x, 10),
          parseInt(activeData['@attributes'].y, 10),
          parseInt(activeData['@attributes'].px, 10),
          parseInt(activeData['@attributes'].py, 10)
        );
      }
      return true;
    });
  }
}

/**
 * @param json
 * @param converter - converter function (f.e. gefx, graphlml)
 * */
function loadAsGraph(json, converter) {
  let i;
  let hasState = false;
  const nodes = [];
  const links = [];

  converter(
    json,
    function(id, node) {
      node.edges = [];
      node.neighbours = [];
      nodes[id] = node;
    },
    function(id, edge) {
      edge.sourceId = edge.source;
      edge.targetId = edge.target;
      links[id] = edge;
      nodes[edge.source].neighbours.push(edge.target);
      nodes[edge.source].edges.push(edge);
      if (edge.source !== edge.target) {
        nodes[edge.target].neighbours.push(edge.source);
        nodes[edge.target].edges.push(edge);
      }
    },
    function(id, x, y, px, py) {
      // currentState.nodes.push({
      //   id: id,
      //   x: x,
      //   fx: x,
      //   y: y,
      //   fy: y,
      //   px: px,
      //   py: py,
      //   fixed: true
      // });
      // hasState = true;
    }
  );
  for (i in nodes) {
    if (nodes.hasOwnProperty(i)) {
      nodes[i].props.degree = nodes[i].neighbours.length;
    }
  }

  return { nodes, links };
  // if (hasState) {
  //   currentState.fix = true;
  //   searchModel.submitSearch({ query: 'MATCH (n)-[r]-(m) RETURN r', type: 'query' });
  // }
}

/**
 * parse xmlString into a xml object
 * */
function parseXml(xmlStr) {
  return new window.DOMParser().parseFromString(xmlStr, 'text/xml');
}

function xmlToJson(xml) {
  var obj = {};
  var i;
  var j;
  var attribute;
  var item;
  var nodeName;
  var old;

  if (xml.nodeType === 1) {
    if (xml.attributes.length > 0) {
      obj['@attributes'] = {};
      for (j = 0; j < xml.attributes.length; j++) {
        attribute = xml.attributes.item(j);
        obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) {
    obj = xml.nodeValue;
  }
  if (xml.hasChildNodes()) {
    for (i = 0; i < xml.childNodes.length; i++) {
      item = xml.childNodes.item(i);
      nodeName = item.nodeName.toLowerCase();
      if (typeof obj[nodeName] === 'undefined') {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof obj[nodeName].push === 'undefined') {
          old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}
