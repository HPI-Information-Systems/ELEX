import React, { Component } from 'react';

import { CardText } from 'react-toolbox/lib/card/Card';
import { Input } from 'react-toolbox/lib/input/Input';
import { FontIcon } from 'react-toolbox/lib/font_icon/FontIcon';
import { TwitterPicker } from 'react-color';
import Slider from 'react-toolbox/lib/slider/Slider';
import Link from 'react-toolbox/lib/link/Link';
import styles from './styles.scss';

import _ from 'lodash';

class ModificationableItem extends Component {
  constructor(props) {
    super(props);

    this.state = { showEditText: false, oldValue: this.props.value };
  }

  // update this.state[field] with value
  handleChange = (value) => {
    this.props.onChange(this.props.label, value);
  };

  triggerShowEdit = () => {
    this.setState({
      showEditText: !this.state.showEditText
    });
  };

  render() {
    const self = this;

    const editText = (
      <Input value={this.props.value} onChange={this.handleChange}/>
    );

    const slider = (
      <Slider step={1} min={5} max={50} editable value={parseInt(this.props.value, 10)} onChange={this.handleChange}/>
    );

    const colorPicker = (
      <TwitterPicker
        width='100%' triangle='hide'
        className={styles.color_picker} color={this.props.value}
        onChangeComplete={function (color) {
          self.handleChange(color.hex);
        }}/>
    );

    let field = editText;
    switch (this.props.label) {
      case '__weight':
        field = slider;
        break;
      case '__color':
        field = colorPicker;
        break;
    }

    return (
      <CardText>
        <div className={styles.attr_container}>
          <span className={styles.attr_name}>
            {this.props.label}:
          </span>
          <span className={`${styles.attr_value} ${self.state.showEditText ? styles.attr_old_val : ''}`}>
            <Link href='#' label={this.state.oldValue.toString()} onClick={this.triggerShowEdit}/>
          </span>
          <span>
            {/*<FontIcon className={styles.attr_delete} value='delete'/>*/}
          </span>
        </div>
        <div className={styles.edit_container}>
          {this.state.showEditText ? field : ''}
        </div>
        <div className={styles.divider}></div>
      </CardText>
    );
  }
}

export default ModificationableItem;
