import React, { Component } from 'react';
import { connect } from 'react-redux';
import D3Network from 'components/D3Network';
import Legend from 'components/Legend';

import _ from 'lodash';

import { showLinkInfo, showNodeInfo } from 'actions/sidebarActions';
import { fetchNeighbours } from 'actions/apiActions';
import {
  callNewGraphEvent,
  callNodeClickEvent,
  callSelectedNodesEvent,
  callSvgClickEvent,
} from 'actions/eventActions';
import { layoutAsDoubleTree } from 'actions/layoutActions';
import { removeNode } from 'actions/suggestionActions';

class GraphView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graph: { nodes: [], links: [] },
      suggestions: [],
      eventListener: {},
      filtered: { filteredNodes: [], filteredLinks: [] },
      savedNodes: {},
      nodePositions: [],
    };

    const self = this;
    // setup eventlistener
    this.state.eventListener.nodes = {
      expand: function(node, depth = 1) {
        self.props.fetchNeighbours(node.id, depth);
      },
      dblclick: function(node) {
        self.props.fetchNeighbours(node.id, 1);
      },
      click: function(node) {
        console.log('click', node);
        self.props.toggleSideBar();
        self.props.showNodeInfo(node);
      },
    };
    this.state.eventListener.links = {
      click: function(link) {
        if (!self.state.sidebarActive) self.props.toggleSideBar();
        self.props.showLinkInfo(link);
      },
    };
    // this.state.eventListener.svg = {
    //   click: function (obj) {
    //     // self.props.callSvgClickEvent(obj);
    //   }
    // };

    this.mergeGraph = this.mergeGraph.bind(this);
  }

  getRiskColors = (risk) => {
    const riskRatio = 1;

    if (risk > 1) risk = 1;
    if (risk < 0) risk = 0;
    let R = (205 * risk) / riskRatio;
    let G = (205 * (riskRatio - risk)) / riskRatio;
    let B = 0;

    let rString = Math.ceil(R).toString(16);
    let gString = Math.ceil(G).toString(16);

    if (rString.length < 2) rString = '0' + rString;
    if (gString.length < 2) gString = '0' + gString;

    return `#${rString}${gString}00`;
  };

  /**
   * @param hasNewSuggestions {boolean} - if a new suggestion was made
   *
   * merge newGraph with the old graph and with all filtered nodes and links
   * then all filters are applied and duplicates are removed
   *
   * at last it writes the new graph and filtered nodes and links to the state
   * */
  mergeGraph(newGraph, newSuggestions, newLayout, nextProps) {
    const hasNewSuggestions = this.props.suggestions !== newSuggestions;
    if ((!newGraph || newGraph.nodes.length === 0) && !hasNewSuggestions) {
      console.log('delete old graph');
      this.setState({
        graph: {
          nodes: [],
          links: [],
          searchId: null,
        },
        filtered: { filteredNodes: [], filteredLinks: [] },
      });
      return;
    }

    const self = this;

    function buildNode(node) {
      if (node.props.risk) {
        node.props.__color = self.getRiskColors(node.props.risk);
      }

      if (!node.props.__weight) node.props.__weight = 20;
      if (!node.props.__color) node.props.__color = self.props.config.getColor(node.type);
      if (!node.props.__hasDetails) node.props.__hasDetails = false;

      node.props.__label = node.props[self.props.config.getLabelAttribute(node.type)];
      return {
        id: node.id,
        type: node.type,
        icon: self.props.config.getIcon(node.type),
        x: node.x,
        y: node.y,
        props: node.props,
      };
    }

    // source and target are later replaced by node objects
    // sourceId and targetId are for filtering purpose
    function buildLink(link) {
      if (!link.props) link.props = {};
      if (link.props.risk) {
        link.props.__color = self.getRiskColors(link.props.risk);
      }

      const undirected = link.isDirected === false;
      link.props.__undirected = undirected;
      if (!link.props.__hasDetails) link.props.__hasDetails = link.hasDetails;
      if (!link.props.__hasDetails) link.props.__hasDetails = false;
      if (!link.props.__weight) link.props.__weight = 2;
      return {
        id: link.id,
        type: link.type,
        props: link.props,
        source: link.sourceId,
        target: link.targetId,
        sourceId: link.sourceId,
        targetId: link.targetId,
      };
    }

    function copyCoords(lastNodes, nodes) {
      var idToNode = _.keyBy(lastNodes, function(n) {
        return n.id;
      });
      nodes.forEach(function(node) {
        var oldNode;
        if (!idToNode.hasOwnProperty(node.id)) return;
        oldNode = idToNode[node.id];
        node.fx = oldNode.fx;
        node.fy = oldNode.fy;
        node.x = oldNode.x;
        node.y = oldNode.y;
        node.vx = 0;
        node.vy = 0;
      });
    }

    const nodeIds = [];
    const filteredNodeIds = [];
    const filteredNodes = [];

    // build nodes from old, new and filtered nodes
    let nodes = this.state.graph.nodes.concat(this.state.filtered.filteredNodes);
    nodes = nodes.concat(newGraph.nodes.map(buildNode));
    nodes = nodes.concat(
      newSuggestions.suggestedNodes.map(function(n) {
        n.props = {};
        n.props.name = n.name;
        return buildNode(n);
      })
    );

    let minRadius = Number.MAX_SAFE_INTEGER,
      maxRadius = Number.MIN_SAFE_INTEGER;
    let minWidth = Number.MAX_SAFE_INTEGER,
      maxWidth = Number.MIN_SAFE_INTEGER;

    nodes = _.remove(nodes, function(node) {
      // remove suggested nodes
      if (newSuggestions.removedNodeIds[node.id]) {
        return false;
      }

      // filter nodes by type
      if (nextProps.filter.nodeTypes[node.type]) {
        filteredNodeIds[node.id] = true;
        filteredNodes.push(node);
        return false;
      }

      // remove duplicates
      if (nodeIds[node.id]) return false;
      nodeIds[node.id] = node;

      return true;
    });

    const lerp = (a, b, t) => {
      return a + t * (b - a);
    };

    const mapRanges = (input_start, input_end, output_start, output_end, t) => {
      if (input_start === input_end) {
        input_end += 2;
        t = input_start + 1;
      }
      const slope = (output_end - output_start) / (input_end - input_start);
      return output_start + Math.round(slope * (t - input_start));
    };

    nodes.forEach((node) => {
      const change = newSuggestions.changes[node.id];
      const tmpChange = newSuggestions.tmpChanges[node.id];
      const savedNodes = self.state.savedNodes;

      node.connected = false;

      if (savedNodes[node.id] && !tmpChange) {
        Object.keys(savedNodes[node.id]).forEach(function(key) {
          node.props[key] = savedNodes[node.id][key];
        });

        savedNodes[node.id] = null;
        self.setState({ savedNodes });
      }

      if (change) {
        Object.keys(change).forEach(function(key) {
          node.props[key] = change[key];
        });
      }

      if (tmpChange) {
        if (!savedNodes[node.id]) {
          savedNodes[node.id] = _.clone(node.props);
          self.setState({ savedNodes });
        }
        Object.keys(tmpChange).forEach(function(key) {
          node.props[key] = tmpChange[key];
        });
      }

      // apply range filter
      node.invisible = false;
      nextProps.filter.rangeFilter
        .filter((filter) => filter.type === 'node')
        .forEach((filter) => {
          if (node.props[filter.attr]) {
            if (
              node.props[filter.attr] < filter.range[0] ||
              node.props[filter.attr] > filter.range[1]
            ) {
              node.invisible = true;
            }
          }
        });

      if (!node.props.radius && node.props.__weight && node.props.__weight > 0) {
        minRadius = Math.min(minRadius, Math.log(node.props.__weight));
        maxRadius = Math.max(maxRadius, Math.log(node.props.__weight));
      }
    });

    nodes.forEach((node) => {
      if (node.props.__radius) {
        node.props.__size = node.props.__radius;
      } else {
        node.props.__size = mapRanges(minRadius, maxRadius, 10, 35, Math.log(node.props.__weight));
      }
    });

    const filteredLinks = [];
    const linkIds = [];

    // build links from old, new and filtered links
    let links = this.state.graph.links.concat(this.state.filtered.filteredLinks);

    // reset node reference - let d3 handle and update it
    // TODO: not sure if we need this
    links.forEach(function(link) {
      link.source = link.sourceId;
      link.target = link.targetId;
    });

    links = links.concat(newGraph.links.map(buildLink));

    links = links.concat(
      newSuggestions.suggestedLinks.map(function(l) {
        return buildLink(l);
      })
    );

    links = _.remove(links, function(link) {
      // if no nodes exists
      if (!nodeIds[link.sourceId] || !nodeIds[link.targetId]) {
        return false;
      }

      // filter links by type or by filtered node
      if (
        filteredNodeIds[link.sourceId] ||
        filteredNodeIds[link.targetId] ||
        self.props.filter.linkTypes[link.type]
      ) {
        filteredLinks.push(link);
        return false;
      }

      // remove duplicates
      if (linkIds[link.id]) return false;
      linkIds[link.id] = true;

      // if source and target is the same
      if (link.sourceId === link.targetId) return false;

      if (!link.props.__width && link.props.__weight && link.props.__weight > 0) {
        minWidth = Math.min(minWidth, Math.log(link.props.__weight));
        maxWidth = Math.max(maxWidth, Math.log(link.props.__weight));
      }

      return true;
    });

    _.each(links, function(link) {
      // find other links with same target+source or source+target
      var same = _.filter(links, {
        source: link.source,
        target: link.target,
      });

      _.each(same, function(s, i) {
        s.__sameIndex = i + 1;
        s.__maxIndex = same.length;
      });
    });

    links.forEach((link) => {
      if (nodeIds[link.sourceId].invisible || nodeIds[link.targetId].invisible)
        link.invisible = true;
      else link.invisible = false;

      // apply range filter
      nextProps.filter.rangeFilter
        .filter((filter) => filter.type === 'link')
        .forEach((filter) => {
          if (link.props[filter.attr]) {
            if (
              link.props[filter.attr] < filter.range[0] ||
              link.props[filter.attr] > filter.range[1]
            ) {
              link.invisible = true;
            }
          }
        });

      if (!link.invisible) {
        nodeIds[link.sourceId].connected = true;
        nodeIds[link.targetId].connected = true;
      }

      if (link.props.__width) {
        link.props.__size = link.props.__width;
      } else {
        link.props.__size = mapRanges(minWidth, maxWidth, 2, 4, Math.log(link.props.__weight));
      }
    });

    nodes.forEach(function(node) {
      if (nextProps.filter.hideUnconnected && !node.connected) {
        node.invisible = true;
      }
    });

    copyCoords(self.props.api.graph.nodes, nodes);

    this.props.callNewGraphEvent({ nodes, links });

    let nodePositions = [];
    if (newLayout.type === 'dbltree') {
      nodePositions = this.buildTreeLayout(nodes, links, newLayout.centerNodes);
    }

    this.setState({
      nodePositions,
      graph: { nodes, links, searchId: newGraph.searchId },
      filtered: { filteredNodes, filteredLinks },
    });
  }

  buildTreeLayout = (nodes, links, centerNodes) => {
    const nodePositions = [];
    const xStep = 300;
    const yStep = 150;
    let maxY = 0;

    const adjacency = [];
    let idToNode = [];
    let labelToNodeId = [];

    nodes.forEach(function(n) {
      idToNode[n.id] = n;
      labelToNodeId[n.props.__label] = n.id;
    });
    links.forEach(function(l) {
      if (!adjacency[l.sourceId]) adjacency[l.sourceId] = { forward: [], backward: [] };
      adjacency[l.sourceId].forward.push(l.targetId);

      if (!adjacency[l.targetId]) adjacency[l.targetId] = { forward: [], backward: [] };
      adjacency[l.targetId].backward.push(l.sourceId);
    });

    const centerIds = [];
    centerNodes.forEach((node) => {
      centerIds.push(labelToNodeId[node.props.__label]);
    });
    labelToNodeId = [];

    const visited = [];
    const forwardQueue = [];
    const backwardQueue = [];
    let forwardNextQueue = [];
    let backwardNextQueue = [];
    let count = 0;
    centerIds.forEach((id) => {
      forwardQueue.push({ id: id, step: 1 });
      backwardQueue.push({ id: id, step: -1 });
      nodePositions[id] = { x: 0, y: count * yStep };
      visited[id] = true;
      count++;
    });

    let yPos = 0;

    while (forwardQueue.length > 0 || backwardQueue.length > 0) {
      let el;
      if (forwardQueue.length > 0) {
        el = forwardQueue.shift();
        adjacency[el.id].forward.forEach(function(childId) {
          if (!visited[childId]) {
            visited[childId] = true;

            nodePositions[childId] = { x: el.step * xStep, y: yPos };
            yPos += yStep;
            maxY = Math.max(yPos, maxY);
            forwardNextQueue.push({ id: childId, step: el.step + 1 });
          }
        });
        if (forwardQueue.length === 0) {
          yPos = 0;
        }
      } else if (backwardQueue.length > 0) {
        el = backwardQueue.shift();
        adjacency[el.id].backward.forEach(function(childId) {
          if (!visited[childId]) {
            visited[childId] = true;

            nodePositions[childId] = { x: el.step * xStep, y: yPos };
            yPos += yStep;
            maxY = Math.max(yPos, maxY);
            backwardNextQueue.push({ id: childId, step: el.step - 1 });
          }
        });
        if (backwardQueue.length === 0) {
          yPos = 0;
        }
      }

      if (forwardQueue.length === 0 && backwardQueue.length === 0) {
        forwardNextQueue.forEach((n) => forwardQueue.push(n));
        backwardNextQueue.forEach((n) => backwardQueue.push(n));
        forwardNextQueue = [];
        backwardNextQueue = [];
      }
    }

    // TODO: center all nodes on y Pos with @maxY

    return nodePositions;
  };

  componentWillReceiveProps(nextProps) {
    if (
      this.props.api.graph !== nextProps.api.graph ||
      this.props.filter !== nextProps.filter ||
      this.props.suggestions !== nextProps.suggestions ||
      this.props.layout.type !== nextProps.layout.type ||
      this.props.layout.centerNodes !== nextProps.layout.centerNodes
    ) {
      this.mergeGraph(nextProps.api.graph, nextProps.suggestions, nextProps.layout, nextProps);
    }
  }

  render() {
    return (
      <div>
        <D3Network
          style={{ zIndex: -999 }}
          layouting={this.props.layouting}
          showLabels={this.props.showLabels}
          nodes={this.state.graph.nodes}
          links={this.state.graph.links}
          nodePositions={this.state.nodePositions}
          searchId={this.state.graph.searchId}
          eventListener={this.state.eventListener}
          selectedNodes={this.props.callSelectedNodesEvent}
          layoutAsTree={(d) => {
            this.props.layoutOff();
            this.props.layoutAsDoubleTree(this.props.events.selected.concat(d));
          }}
          removeNode={this.props.removeNode}
          useCurvedEdges={this.props.layout.useCurvedEdges}
        />

        <Legend />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    api: state.api,
    config: state.config,
    filter: state.filter,
    suggestions: state.suggestions,
    layout: state.layout,
    events: state.events,
  };
}

export default connect(
  mapStateToProps,
  {
    fetchNeighbours,
    showNodeInfo,
    showLinkInfo,
    callNodeClickEvent,
    callSvgClickEvent,
    callSelectedNodesEvent,
    callNewGraphEvent,
    layoutAsDoubleTree,
    removeNode,
  }
)(GraphView);
