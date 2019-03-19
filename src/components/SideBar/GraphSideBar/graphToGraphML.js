import { select } from 'd3-selection';

export default function graphToGraphML() {
  const svgSelection = select('#d3Network');
  const nodeSelection = svgSelection.selectAll('.gNodes .node');
  const linkSelection = svgSelection.selectAll('.gLinks .link');

  const nodes = [];
  const links = [];
  const keys = [];

  nodeSelection.select(function(v) {
    nodes.push(v);
  });

  linkSelection.select(function(e) {
    links.push(e);
  });

  const graphArray = constructGraphArray(nodes, links);
  let graphString = '';
  graphArray.forEach(function(data) {
    graphString += data;
  });
  return graphString;
}

function constructGraphArray(nodes, links) {
  const data = [];
  const activeData = [];
  let keys = [];
  let indentVal = 0;

  pushData('<?xml version="1.0" encoding="UTF-8"?>');
  pushData('<graphml xmlns="http://graphml.graphdrawing.org/xmlns"');
  indent();
  indent();
  pushData('xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"');
  pushData('xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns');
  pushData('http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">');
  reindent();

  // add keys
  pushData('<key id="v_type" for="node" attr.name="type" attr.type="string"/>');
  nodes.forEach(function(node) {
    for (let k in node.props) {
      if (k !== 'id') {
        if (!keys[k]) {
          pushData('<key id="v_' + k + '" for="node" attr.name="' + k + '" attr.type="string"/>');
        }
        keys[k] = true;
      }
    }
  });
  keys = [];
  pushData('<key id="e_type" for="edge" attr.name="type" attr.type="string"/>');
  links.forEach(function(link) {
    for (let k in link.props) {
      if (!keys[k]) {
        pushData('<key id="e_' + k + '" for="edge" attr.name="' + k + '" attr.type="string"/>');
      }
      keys[k] = true;
    }
  });

  pushData('<graph>');
  indent();

  // add nodes and links
  nodes.forEach(function(node) {
    pushNode(node);
  });
  links.forEach(function(link) {
    pushLink(link);
  });
  // add active state
  activeData.forEach(function(active) {
    data.push(active);
  });

  reindent();
  pushData('</graph>');
  reindent();
  pushData('<graphml>');

  return data;

  function pushData(str) {
    let indentStr = '';
    for (let i = 0; i < indentVal * 2; i++) {
      indentStr += ' ';
    }
    indentStr += str;
    data.push(indentStr + '\n');
  }

  function pushActiveData(str) {
    activeData.push('    ' + str + '\n');
  }

  function indent() {
    indentVal++;
  }

  function reindent() {
    indentVal--;
  }

  function pushNode(node) {
    pushData('<node id="' + node.id + '">');
    indent();
    pushData('<data key="v_type">' + node.type + '</data>');
    for (let prop in node.props) {
      if (node.props[prop] && prop !== 'id' && prop !== 'degree') {
        pushData('<data key="v_' + prop + '">' + node.props[prop] + '</data>');
      }
    }
    reindent();
    pushData('</node>');

    pushActiveData(
      '<active-data type="node" id="' +
        node.id +
        '" x="' +
        node.x +
        '" y="' +
        node.y +
        '" px="' +
        node.px +
        '" py="' +
        node.py +
        '" />'
    );
  }

  function pushLink(edge) {
    console.log(edge);
    pushData('<edge source="' + edge.sourceId + '" target="' + edge.targetId + '">');
    indent();
    pushData('<data key="e_type">' + edge.type + '</data>');
    for (let prop in edge.props) {
      if (edge.props[prop]) {
        pushData('<data key="e_' + prop + '">' + edge.props[prop] + '</data>');
      }
    }
    reindent();
    pushData('</edge>');
  }
}
