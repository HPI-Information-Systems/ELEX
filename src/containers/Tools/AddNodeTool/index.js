import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Form, Input, Modal, notification } from 'antd';

import { addNode } from 'actions/suggestionActions';
import FormItem from 'antd/lib/form/FormItem';

import styles from './addNodeTool.module.scss';

class AddNodeTool extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: '',
      name: '',
    };
  }

  toggleDialog = () => {
    this.props.toggleTool();
  };

  createNode = () => {
    const { name, type } = this.state;
    this.props.addNode(type, name);
    this.toggleDialog();
    notification.info({
      message: `Added node: ${name}`,
      description: 'This node exists only in this tool and is not saved anywhere!',
    });
    this.setState({ name: '', type: '' });
  };

  handleChange = (name, ev) => {
    const newState = {};
    newState[name] = ev.target.value;
    this.setState(newState);
  };

  render() {
    const { active, config } = this.props;
    const { type, name } = this.state;

    return (
      <Modal
        visible={active}
        title="Add a new node to the graph"
        onCancel={this.toggleDialog}
        onOk={this.createNode}
        okText="Add Node"
      >
        <Form>
          <FormItem label="Node Type">
            <Input
              value={type}
              onChange={(ev) => this.handleChange('type', ev)}
              prefix={
                <i className={`material-icons ${styles.prefixIcon}`}>{config.getIcon(type)}</i>
              }
            />
          </FormItem>
          <FormItem label="Node Name">
            <Input value={name} onChange={(ev) => this.handleChange('name', ev)} icon="add" />
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
  { addNode }
)(AddNodeTool);
