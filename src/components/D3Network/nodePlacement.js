import _ from 'lodash';
import { randomNormal } from 'd3';

/**
 * Distribute new nodes evenly: Take the last search and check if it was for a node and if
 * that node was already in the graph. If it was, distribute around it. If not, use the
 * center of width and height.
 */
export function distributeNodes(nodes, searchId, width, height) {
  // Take last search and check if the node was already in the graph
  const idMap = _.keyBy(nodes, function (n) {
    return n.id;
  });
  const searchedNode = idMap[searchId];
  const wasInGraph = (searchedNode !== undefined
    && searchedNode.x !== undefined && searchedNode.y !== undefined);

  const mean = {};
  const std = 100;
  const distribution = {};

  if (wasInGraph) {
    // If the node was in the graph, center the distribution around it
    mean.x = searchedNode.x;
    mean.y = searchedNode.y;
  } else {
    // If the node was not in the graph, take the screen center
    mean.x = width / 2;
    mean.y = height / 2;

    // If the last search was for a new node, center that node in the center
    if (searchedNode !== undefined) {
      nodes = nodes.map(function (n) {
        if (n.id === searchedNode.id) {
          n.x = mean.x;
          n.vx = 0;
          n.y = mean.y;
          n.vy = 0;
          n.fixed = true;
        }
        return n;
      });
    }
  }

  // Use a normal distribution to place all the nodes with coordinates unset
  distribution.x = randomNormal(mean.x, std);
  distribution.y = randomNormal(mean.y, std);
  nodes = nodes.map(function (n) {
    if (n.x === undefined) {
      n.vx = 0;
      n.x = distribution.x();
    }
    if (n.y === undefined) {
      n.vy = 0;
      n.y = distribution.y();
    }
    return n;
  });

  return nodes;
}

/**
 * Set the weight of each node
 * */
export function calcNodeWeight(nodes, links) {
  var node;
  var link;
  var nodeList = [];

  nodes.forEach(function (node) {
    nodeList[node.id] = node;
    nodeList[node.id].weight = 0;
  });

  links.forEach(function (link) {
    nodeList[link.sourceId].weight++;
    nodeList[link.targetId].weight++;
  });
}

/**
 * copy position from old node to new node
 * @param oldNodes - nodes from previous state
 * @param newNodes - nodes that should get the old positions
 * */
export function copyCoords(oldNodes, newNodes) {
  const idToNode = [];
  oldNodes.forEach(function (node) {
    idToNode[node.id] = node;
  });

  newNodes.forEach(function (node) {
    const oldNode = idToNode[node.id];
    if (oldNode) {
      node.x = oldNode.x;
      node.y = oldNode.y;
      // node.fx = oldNode.fx;
      // node.fy = oldNode.fy;
      node.vx = oldNode.vx;
      node.vy = oldNode.vy;

    }
  });
}
