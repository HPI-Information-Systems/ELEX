import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import used d3 forces
import {
  event,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  scaleLinear,
  select,
  zoom,
} from 'd3';
// used tick function
import tick from './d3Tick';
// d3 enter update patterns
import nodeUpdatePattern from './updatePatternNodes';
import linkUpdatePattern from './updatePatternLinks';
import arrowUpdatePattern from './updatePatternArrows';
import textUpdatePattern from './updatePatternText';
import highlightUpdatePattern from './updatePatternHighlight';
// function that distributes nodes in a circle like shape
import { calcNodeWeight, copyCoords, distributeNodes } from './nodePlacement';
// functions for multiselect
import { mouseDownBrush, mouseMoveBrush, mouseUpBrush } from './multiselect';

import _ from 'lodash';
import styles from './styles.module.scss';

class D3Network extends Component {
  constructor(props) {
    super(props);
    this.state = { nodes: [], links: [], selectedNodeIds: [], useContextMenu: false };

    this.mapToXScale = this.mapToXScale.bind(this);
    this.mapToYScale = this.mapToYScale.bind(this);
    this.mapToXScaleInverted = this.mapToXScaleInverted.bind(this);
    this.mapToYScaleInverted = this.mapToYScaleInverted.bind(this);

    this.showLabels = true;
  }

  componentWillUnmount() {
    this.simulation.stop();
  }

  componentWillReceiveProps(nextProps) {
    this.reassignSimulationBoundaries();

    if (
      nextProps.nodes === this.props.nodes &&
      nextProps.nodePositions === this.props.nodePositions &&
      nextProps.layouting === this.props.layouting
    ) {
      if (nextProps.showLabels !== this.props.showLabels) {
        this.showLabels = nextProps.showLabels;
        this.updateD3Bindings(this.state.nodes, this.state.links, 'all');
      }
      if (nextProps.useCurvedEdges !== this.props.useCurvedEdges) {
        tick.bind(this)(this.network, this);
      }
      return;
    }

    // copy props into state because d3 manipulates nodes and links and
    // props should be immutable
    let newNodes = _.cloneDeep(nextProps.nodes);
    const newLinks = _.cloneDeep(nextProps.links);

    let oldPositions = {};
    this.simulation.nodes().forEach((node) => {
      oldPositions[node.id] = node;
    });

    newNodes.forEach((node) => {
      if (nextProps.nodePositions[node.id]) {
        const x = nextProps.nodePositions[node.id].x;
        const y = nextProps.nodePositions[node.id].y;
        node.x = node.fx = x;
        node.y = node.fy = y;
      } else {
        if (!this.props.layouting && nextProps.layouting) {
          node.fx = undefined;
          node.fy = undefined;
        } else {
          if (oldPositions[node.id]) {
            node.x = oldPositions[node.id].x;
            node.fx = oldPositions[node.id].fx;

            node.y = oldPositions[node.id].y;
            node.fy = oldPositions[node.id].fy;
          }
        }
      }
    });
    oldPositions = {};

    if (!nextProps.layouting && this.simulation.alpha() < 0.01) {
      this.network.select('.gNodes').each(function(d) {
        if (d) {
          if (d.x) d.fx = d.x;
          if (d.y) d.fy = d.y;
        }
      });
    }

    // copy coords from old nodes to new so that the network remains stable
    copyCoords(this.state.nodes, newNodes);
    calcNodeWeight(newNodes, newLinks);
    newNodes = distributeNodes(newNodes, nextProps.searchId, this.width, this.height);

    // d3 enter-update-exit pattern
    this.updateD3Bindings(newNodes, newLinks);

    this.simulation.nodes(newNodes);
    this.simulation.force('link').links(newLinks);

    if (nextProps.layouting || !this.props.layouting) {
      this.simulation.restart();
      this.simulation.alpha(1);
    }

    this.setState({ nodes: newNodes, links: newLinks });
  }

  updateD3Bindings = (nodes, links, type = 'all') => {
    switch (type) {
      case 'nodes':
        nodeUpdatePattern.bind(this)(this.network.select('.gNodes'), nodes);
        break;
      case 'links':
        linkUpdatePattern.bind(this)(this.network.select('.gLinks'), links);
        arrowUpdatePattern.bind(this)(this.network, links);
        break;
      case 'texts':
        textUpdatePattern.bind(this)(this.network.select('.gTexts'), nodes);
        break;
      case 'highlight':
        highlightUpdatePattern.bind(this)(this.network.select('.gHighlights'), nodes);
        break;
      case 'all':
      default:
        nodeUpdatePattern.bind(this)(this.network.select('.gNodes'), nodes);
        linkUpdatePattern.bind(this)(this.network.select('.gLinks'), links);
        arrowUpdatePattern.bind(this)(this.network, links);
        textUpdatePattern.bind(this)(this.network.select('.gTexts'), nodes);
        highlightUpdatePattern.bind(this)(this.network.select('.gHighlights'), nodes);
        break;
    }
  };

  // need this so that react doesn't change our component
  // this disables the functions: willComponentUpdate and componentDidUpdate
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  /**
   * one time setup of all forces and svg groups
   * */
  componentDidMount() {
    this.network = select(ReactDOM.findDOMNode(this.refs.network));
    this.network.selectAll('*').remove();
    this.width = parseInt(select(`svg.${styles.network}`).style('width'), 10);
    this.height = parseInt(select(`svg.${styles.network}`).style('height'), 10);

    // append svg groups
    this.network.append('g').attr('class', 'gLinks');
    this.network.append('g').attr('class', 'gNodes');
    this.network.append('g').attr('class', 'gHighlights');
    this.network.append('g').attr('class', 'gTexts');
    this.network.append('g').attr('class', 'gBrush');
    this.network.append('defs').attr('class', 'gDevs');

    // setup forces
    const manyBodyForce = forceManyBody()
      .strength(this.props.forceStrength)
      .distanceMin((d) => parseInt(d.props.__radius, 10) * 2);

    const linkForce = forceLink()
      .id((d) => d.id)
      .distance((link) => Math.sqrt(link.target.weight + link.source.weight) * 20)
      .links(this.state.links);

    // setup simulation
    this.simulation = forceSimulation(this.state.nodes)
      .force('charge', manyBodyForce)
      .force('link', linkForce)
      .force(
        'x',
        forceX()
          .x(this.width / 2)
          .strength(0.1)
      )
      .force(
        'y',
        forceY()
          .y(this.height / 2)
          .strength(0.1)
      )
      .on('tick', () => {
        tick.bind(this)(this.network, this);
      });

    const zoomFct = zoom()
      .scaleExtent([1 / 32, 4])
      .on('zoom', () => {
        this.zoomFactor = event.transform.k;

        this.currentXScale = event.transform.rescaleX(this.xScale);
        this.currentYScale = event.transform.rescaleY(this.yScale);

        this.simulation.restart();
        this.simulation.tick();
      });

    select(`svg.${styles.network}`)
      .on('mousedown', mouseDownBrush.bind(this))
      .on('mousemove', () => {
        mouseMoveBrush.bind(this)();
        highlightUpdatePattern.bind(this)(this.network.select('.gHighlights'), this.state.nodes);
        tick.bind(this)(this.network, this);
      })
      .on('mouseup', () => {
        mouseUpBrush.bind(this)();
        select(`svg.${styles.network}`).call(zoomFct);
      })
      .call(zoomFct)
      .on('dblclick.zoom', null);

    // for (const key in self.props.eventListener.svg) {
    //   if (self.props.eventListener.svg.hasOwnProperty(key)) {
    //     // self.network.select(`rect.${styles.background}`).on(key, self.props.eventListener.svg[key].bind(this,));
    //     select(`svg.${styles.network}`).on(key, self.props.eventListener.svg[key].bind(this,));
    //   }
    // }

    // scales
    this.xScale = scaleLinear()
      .domain([0, this.width])
      .range([0, this.width]);
    this.yScale = scaleLinear()
      .domain([0, this.height])
      .range([0, this.height]);

    this.simulation.restart();
  }

  // update width and height to current svg boundaries
  reassignSimulationBoundaries = () => {
    this.width = parseInt(select(`svg.${styles.network}`).style('width'), 10);
    this.height = parseInt(select(`svg.${styles.network}`).style('height'), 10);

    this.simulation
      .force(
        'x',
        forceX()
          .x(this.width / 2)
          .strength(0.1)
      )
      .force(
        'y',
        forceY()
          .y(this.height / 2)
          .strength(0.1)
      );

    this.xScale = scaleLinear()
      .domain([0, this.width])
      .range([0, this.width]);
    this.yScale = scaleLinear()
      .domain([0, this.height])
      .range([0, this.height]);
  };

  expandNode = (id, depth) => {};

  updateSelectedNodes = () => {
    const selected = [];
    this.state.nodes.forEach(function(n) {
      if (n.selected) selected.push(n);
    });
    this.props.selectedNodes(selected);
  };

  /**
   * add nodeId to the list of all selected nodes
   * and update the highlight of all nodes
   * */
  onClickNode = function(node) {
    node.selected = !node.selected;
    this.props.eventListener.nodes.click(node);
    this.updateSelectedNodes();
    highlightUpdatePattern.bind(this)(this.network.select('.gHighlights'), this.state.nodes);
  };

  /**
   * add nodeId to the list of all selected nodes
   * and update the highlight of all nodes
   * */
  showClickedNode = function(node) {
    // node.selected = !node.selected;
    this.props.eventListener.nodes.click(node);
    // this.updateSelectedNodes();
    // highlightUpdatePattern.bind(this)(this.network.select('.gHighlights'), this.state.nodes);
  };

  deselectAll = function() {
    this.state.nodes.forEach(function(node) {
      node.selected = false;
    });

    this.props.selectedNodes([]);
    highlightUpdatePattern.bind(this)(this.network.select('.gHighlights'), this.state.nodes);
  };

  mapToXScale = function(x) {
    if (this.currentXScale) return this.currentXScale(x);
    return x;
  };

  mapToXScaleInverted = function(x) {
    if (this.currentXScale) return this.currentXScale.invert(x);
    return x;
  };

  mapToYScale = function(y) {
    if (this.currentYScale) return this.currentYScale(y);
    return y;
  };

  mapToYScaleInverted = function(y) {
    if (this.currentYScale) return this.currentYScale.invert(y);
    return y;
  };

  render() {
    return (
      <div>
        <svg id="network-svg" className={styles.network}>
          <g id="d3Network" ref="network" />
        </svg>
      </div>
    );
  }
}

D3Network.defaultProps = {
  linkDistance: 30,
  linkStrength: 0.8,
  // forceStrength: -20,
  forceStrength: -1800,
  defaultNodeColor: '#3333ff',
  defaultIconColor: '#000000',
  defaultLinkColor: '#CCC',
};

export default D3Network;
