import React from 'react';
import { connect } from 'react-redux';

import { filterEdgeType, filterVertexType } from 'actions/filterActions';
import _ from 'lodash';

import styles from './legend.module.scss';

const Legend = ({ events, config, filterVertexType, filterEdgeType, suggestions, filter }) => {
  const { graph } = events;
  const vertexIconTypes = [];
  const edgeIconTypes = [];

  // the brightness_1 icon is a circle that indicates an default icon
  graph.nodes.forEach((node) => {
    vertexIconTypes[node.type] = config.getIcon(node.type);
  });

  suggestions.suggestedNodes.forEach((node) => {
    vertexIconTypes[node.type] = config.getIcon(node.type);
  });

  Object.keys(filter.nodeTypes).forEach((type) => {
    vertexIconTypes[type] = config.getIcon(type);
  });

  const vertexKeyList = _.sortBy(Object.keys(vertexIconTypes), [(o) => o]);
  console.log(vertexKeyList);

  // every link gets the same icon
  graph.links.forEach((link) => {
    edgeIconTypes[link.type] = 'remove';
  });

  suggestions.suggestedLinks.forEach((link) => {
    edgeIconTypes[link.type] = 'remove';
  });

  Object.keys(filter.linkTypes).forEach((type) => {
    edgeIconTypes[type] = 'remove';
  });

  const edgeKeyList = _.sortBy(Object.keys(edgeIconTypes), [(o) => o]);

  return (
    <div className={styles.container}>
      {vertexKeyList.map((type) => {
        return (
          <a
            onClick={() => filterVertexType(type)}
            key={`node_${type}`}
            className={`${styles.link} ${
              filter.nodeTypes[type] ? styles.clicked : ''
              }`}
          >
            <abbr>{type}</abbr>
            <i className="material-icons">{vertexIconTypes[type]}</i>
          </a>
        );
      })}
      {edgeKeyList.map((type) => {
        return (
          <a
            onClick={() => filterEdgeType(type)}
            key={`link_${type}`}
            className={`${styles.link} ${
              filter.linkTypes[type] ? styles.clicked : ''
              }`}
          >
            <abbr>{type}</abbr>
            <i className="material-icons">{edgeIconTypes[type]}</i>
          </a>
        );
      })}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    events: state.events,
    config: state.config,
    filter: state.filter,
    suggestions: state.suggestions,
  };
}

export default connect(
  mapStateToProps,
  { filterVertexType, filterEdgeType },
)(Legend);
