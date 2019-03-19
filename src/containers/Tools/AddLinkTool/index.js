import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addLink } from 'actions/suggestionActions';
import { Form, Modal, notification, Input } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import styles from '../AddNodeTool/addNodeTool.module.scss';

class AddLinkTool extends Component {
  constructor(props) {
    super(props);

    this.state = { type: '' };
  }

  toggleDialog = () => {
    this.props.toggleTool();
  };

  createLink = () => {
    const self = this;
    const nodes = this.props.nodes;
    const usedNodeIds = {};
    nodes.forEach((n1) => {
      usedNodeIds[n1.id] = true;

      nodes.forEach((n2) => {
        if (!usedNodeIds[n2.id]) {
          self.props.addLink(self.state.type, n1.id, n2.id);
        }
      });
    });

    if (nodes.length >= 2) {
      notification.info({
        message: `Added edge(s)`,
        description: 'This edge exists only in this tool and is not saved anywhere!',
      });
    } else {
      notification.error({
        message: `Couldn't add edge!`,
        description: 'You need to select at least two nodes in the graph!',
      });
    }
    this.toggleDialog();
  };

  handleChange = (name, ev) => {
    const newState = {};
    newState[name] = ev.target.value;
    this.setState(newState);
  };

  render() {
    const { active, config } = this.props;
    const { type } = this.state;

    return (
      <Modal
        visible={active}
        title="Add a new edge to the graph"
        onCancel={this.toggleDialog}
        onOk={this.createLink}
        okText="Add Edge"
      >
        <Form>
          <FormItem label="Edge Type">
            <Input
              value={type}
              onChange={(ev) => this.handleChange('type', ev)}
            />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    config: state.config,
  };
}

export default connect(
  mapStateToProps,
  { addLink }
)(AddLinkTool);
