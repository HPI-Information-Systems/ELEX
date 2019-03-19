import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sidebarShow, sidebarShowFilter } from 'actions/sidebarActions';
import { layoutWithForce } from 'actions/layoutActions';

import pngSaver from 'save-svg-as-png';

import ToolIcon from './ToolIcon';
import styles from './styles.module.scss';

class ToolBar extends Component {
  static propTypes = {
    toggleState: PropTypes.func.isRequired,
    sidebarActive: PropTypes.bool.isRequired,

    showLabels: PropTypes.bool.isRequired,

    layouting: PropTypes.bool.isRequired,
  };

  toolbarChange = (type) => {
    const { sidebar, toggleState, sidebarActive } = this.props;

    console.log(type);

    if (sidebar.currentView === type) {
      toggleState('sidebarActive');
    } else if (sidebarActive) {
      this.props.sidebarShow(type);
    } else {
      this.props.sidebarShow(type);
      toggleState('sidebarActive');
    }
  };

  saveScreenshot = () => {
    pngSaver.saveSvgAsPng(document.getElementById('network-svg'), 'graph-screenshot.png', {
      scale: 2,
    });
  };

  render() {
    const { sidebar, sidebarActive, layouting, showLabels, api, toggleState } = this.props;

    const disableInfo = api.graph.nodes.length <= 0;

    const filterActive = sidebar.currentView === 'filter' && sidebarActive;
    const graphActive = sidebar.currentView === 'graph' && sidebarActive;
    const infoActive = !disableInfo && sidebar.currentView === 'info' && sidebarActive;

    return (
      <div style={{ zIndex: 99 }} className={styles.toolbar}>
        <ToolIcon
          tooltip="Graph Options"
          icon="save"
          active={graphActive}
          onClick={() => this.toolbarChange('graph')}
        />
        <ToolIcon
          tooltip="View Vertex Attributes"
          icon="info-circle"
          active={infoActive}
          onClick={() => this.toolbarChange('info')}
          disabled={disableInfo}
        />
        <ToolIcon
          tooltip="Filter"
          icon="filter"
          active={filterActive}
          onClick={() => this.toolbarChange('filter')}
          disabled={disableInfo}
        />
        <ToolIcon
          tooltip="Screenshot of Graph"
          icon="camera"
          onClick={this.saveScreenshot}
          disabled={disableInfo}
        />
        <div className={styles.bottom_bar}>
          <ToolIcon
            tooltip="Re-Layout Graph"
            icon="reload"
            rolling
            active={layouting}
            onClick={() => {
              toggleState('layouting');
              this.props.layoutWithForce();
            }}
          />
          <ToolIcon
            tooltip="Show Node Names"
            icon="font-size"
            active={showLabels}
            onClick={() => toggleState('showLabels')}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { sidebar: state.sidebar, api: state.api };
}

export default connect(
  mapStateToProps,
  { sidebarShowFilter, sidebarShow, layoutWithForce }
)(ToolBar);
