import React, { Component } from 'react';

import listStyles from 'react-toolbox/lib/list/theme.css'

import Switch from 'react-toolbox/lib/switch/Switch';
import styles from './styles.scss';

/**
 * usage: <SwitchItem id={object} handleChange={function} label={string}\>
 * */
export default class SwitchItem extends Component {
  constructor(props) {
    super(props);

    this.state = { switch_on: false };
  }

  handleChange = () => {
    this.props.handleChange.bind(this, this.props.id, !this.state.switch_on)();
    this.setState({ switch_on: !this.state.switch_on });
  };

  render() {
    return (
      <span className={`${listStyles.item}`}>
          <span className={`${listStyles.itemContentRoot}`}>
            <span className={`${listStyles.itemText}`}>
              {this.props.label}
            </span>
          </span>
          <span className={`${listStyles.left}`}>
            <span className={`${listStyles.itemAction}`}>
              <Switch
                checked={this.state.switch_on}
                onChange={this.handleChange}
              />
            </span>
          </span>
        </span>);
  }
}
