import React, { Component } from 'react';
import { connect } from 'react-redux';
import FabMenu from 'components/utils/FabMenu';
import AddNodeTool from 'containers/Tools/AddNodeTool';
import AddLinkTool from 'containers/Tools/AddLinkTool';
// import DoubleTreeLayoutTool from 'containers/Tools/DoubleTreeLayoutTool';

class Tools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddNodeTool: false,
      showAddLinkTool: false,
      showLayoutTool: false,
    };
  }

  toggleEvent = (type) => {
    const newState = {};
    newState[type] = !this.state[type];
    this.setState(newState);
  };

  render() {
    const pos = 'bottom-right';
    const trigger = 'hover';

    return (
      <div>
        <AddNodeTool
          active={this.state.showAddNodeTool}
          toggleTool={this.toggleEvent.bind(this, 'showAddNodeTool')}
        />
        <AddLinkTool
          active={this.state.showAddLinkTool}
          toggleTool={this.toggleEvent.bind(this, 'showAddLinkTool')}
          nodes={this.props.events.selected}
        />

        <FabMenu position={pos} trigger={trigger}>
          <FabMenu.Item
            icon="plus-circle"
            hint="Add a node to the graph"
            onClick={() => this.toggleEvent('showAddNodeTool')}
          />
          <FabMenu.Item
            icon="minus"
            hint="Add an edge to the graph"
            onClick={() => this.toggleEvent('showAddLinkTool')}
          />
        </FabMenu>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { events: state.events };
}

export default connect(
  mapStateToProps,
  {}
)(Tools);
