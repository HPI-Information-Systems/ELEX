import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip, Input } from 'antd';
import styles from './styles.module.scss';

const TYPE_CLICK = 'click';
const TYPE_HOVER = 'hover';

export default class FabMenu extends Component {
  static propTypes = {
    trigger: PropTypes.oneOf([TYPE_CLICK, TYPE_HOVER]),
    position: PropTypes.string,
    mainIcon: PropTypes.string,
  };

  static defaultProps = {
    trigger: TYPE_HOVER,
    position: 'bottom-right',
    mainIcon: 'more',
  };

  static Item = ({ icon, hint, onClick }) => {
    return (
      <Tooltip title={hint} placement="left">
        <Button
          icon={icon}
          shape="circle"
          size="default"
          onClick={onClick}
          className={styles.fab_clickable}
        />
      </Tooltip>
    );
  };

  constructor(props) {
    super(props);

    this.state = { expanded: false };

    if (props.trigger === TYPE_CLICK) {
      this.state.trigger = TYPE_CLICK;
    } else {
      this.state.trigger = TYPE_HOVER;
    }
  }

  getPosition = () => {
    const { position } = this.props;
    let pos = styles.fab_bottom_right;

    if (position)
      switch (position) {
        case 'top-left':
          pos = styles.fab_top_left;
          break;
        case 'top-right':
          pos = styles.fab_top_right;
          break;
        case 'bottom-left':
          pos = styles.fab_bottom_left;
          break;
        default:
          pos = styles.fab_bottom_right;
          break;
      }

    return pos;
  };

  toggleExpand = () => {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  };

  expandMenu = () => {
    this.setState({ expanded: true });
  };

  onMouseLeave = () => {
    const { trigger } = this.state;
    if (trigger === TYPE_HOVER) this.toggleExpand();
  };

  onClick = () => {
    const { trigger } = this.state;
    if (trigger === TYPE_CLICK) this.toggleExpand();
  };

  onMouseEnter = () => {
    const { trigger } = this.state;
    if (trigger === TYPE_HOVER) this.expandMenu();
  };

  buttonElement = (item) => {
    return (
      <Tooltip title={item.hint} placement="left">
        <Button icon={item.icon} shape="circle" size="default" />
      </Tooltip>
    );
  };

  mainElement = (item) => {
    return <Button icon={item.icon} shape="circle" size="large" type="primary" />;
  };

  itemClick = (item) => {
    this.toggleExpand();
    item.callback();
  };

  render() {
    const { mainIcon, children } = this.props;
    const { expanded } = this.state;

    return (
      <div className={this.getPosition()} onMouseLeave={this.onMouseLeave}>
        <ul className={styles.fab_list}>
          {children.map((child) => (
            <li className={`${styles.fab_item} ${expanded ? styles.zoom_in : styles.zoom_out}`}>
              {child}
            </li>
          ))}
        </ul>
        <div className={styles.fab_main} onMouseEnter={this.onMouseEnter} onClick={this.onClick}>
          {this.mainElement({ icon: mainIcon })}
        </div>
      </div>
    );
  }
}
