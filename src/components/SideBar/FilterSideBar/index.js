import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Card, Select, Checkbox, Form } from 'antd';

import _ from 'lodash';

import { showNodeInfo } from 'actions/sidebarActions';
import { removeNode } from 'actions/suggestionActions';
import { changeRangeFilters, hideUnconnected } from 'actions/filterActions';

import AttributeFilter from './AttributeFilter';

import styles from './filterSideBar.module.scss';

const FormItem = Form.Item;
const Option = Select.Option;

class FilterSideBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      attributes: {},
      filter: [],
      attrDropDown: '',
      hideUnconnected: false,
    };
  }

  componentDidMount() {
    this.props.filter.rangeFilter.forEach((filter) =>
      this.createNewFilterWithRange(filter.type, filter.attr, filter.range)
    );
    this.setState({ hideUnconnected: this.props.filter.hideUnconnected });
  }

  isNumber = (input) => {
    return input && !isNaN(input);
  };

  createDropDownList = (collection, type) => {
    const { filter } = this.state;

    const attributes = [];
    // check if every node/link has the same value for a key or not
    const attributeSpread = [];
    const usedFilter = {};
    filter
      .filter((appliedFilter) => appliedFilter.type === type)
      .forEach((appliedFilter) => {
        usedFilter[appliedFilter.attr] = true;
      });

    collection.forEach((obj) => {
      Object.keys(obj.props).forEach((key) => {
        if (this.isNumber(obj.props[key]) && !usedFilter[key]) {
          if (attributeSpread[key] === true) {
            return;
          }

          if (attributeSpread[key] === undefined) {
            attributeSpread[key] = obj.props[key];
          } else if (attributeSpread[key] !== obj.props[key]) {
            attributeSpread[key] = true;
            attributes.push(key);
          }
        }
      });
    });

    return attributes;
  };

  /**
   * type can be 'node' or 'link'
   * */
  createAttrList = (type) => {
    const attributes = [];

    this.props.graph[`${type}s`].forEach((obj) => {
      const keys = Object.keys(obj.props);
      for (let index in keys) {
        if (keys.hasOwnProperty(index)) {
          if (this.isNumber(obj.props[keys[index]])) {
            if (attributes[keys[index]]) {
              attributes[keys[index]].min = Math.min(
                attributes[keys[index]].min,
                obj.props[keys[index]]
              );
              attributes[keys[index]].max = Math.max(
                attributes[keys[index]].max,
                obj.props[keys[index]]
              );
            } else {
              attributes[keys[index]] = {};
              attributes[keys[index]].min = obj.props[keys[index]];
              attributes[keys[index]].max = obj.props[keys[index]];
            }
          }
        }
      }
    });

    return attributes;
  };

  createNewFilterWithRange = (type, attr, startRange) => {
    const attributes = this.createAttrList(type);

    const newFilter = {};
    newFilter.attr = attr;
    newFilter.minVal = attributes[attr].min;
    newFilter.maxVal = attributes[attr].max;
    newFilter.range = startRange || [newFilter.minVal, newFilter.maxVal];
    newFilter.type = type;

    const filter = this.state.filter;
    filter.push(newFilter);
    this.setState({ filter });
  };

  removeFilter = (type, attr) => {
    let filter = this.state.filter;
    filter = _.filter(filter, (f) => f.type !== type || f.attr !== attr);
    this.setState({ filter });
    this.props.changeRangeFilters(filter);
  };

  createNewFilter = (type, attr) => {
    console.log(type, attr);
    this.createNewFilterWithRange(type, attr);
  };

  /**
   * @param type ("Node"|"Link")
   * @param attr (String) - attribute key
   * @param range ([Number, Number]) - new range
   * */
  changeFilterValue = (type, attr, range) => {
    const { filter } = this.state;

    filter.forEach((appliedFilter) => {
      if (appliedFilter.attr === attr && appliedFilter.type === type) {
        appliedFilter.range = range;
      }
    });

    this.setState({ filter });
    this.props.changeRangeFilters(filter);
  };

  changeHideNodes = (ev) => {
    this.setState({ hideUnconnected: ev.target.checked });
    this.props.hideUnconnected(ev.target.checked);
  };

  render() {
    const { hideUnconnected, filter } = this.state;

    return (
      <Card>
        <div className={styles.card}>
          <div className={`${styles.card_title}`}>
            <h2>Attribute Filter</h2>
          </div>
          <div className={styles.sidebar_scroll}>
            <Form>
              <Checkbox checked={hideUnconnected} onChange={this.changeHideNodes}>
                Hide Nodes without Edges
              </Checkbox>

              <FormItem label="Filter by Node Attributes">
                <Select onChange={(attr) => this.createNewFilter('node', attr)}>
                  {this.createDropDownList(this.props.graph.nodes, 'node').map((attr) => {
                    return <Option value={attr}>{attr}</Option>;
                  })}
                </Select>
              </FormItem>

              <FormItem label="Filter by Edge Attributes">
                <Select onChange={(attr) => this.createNewFilter('link', attr)}>
                  {this.createDropDownList(this.props.graph.links, 'link').map((attr) => {
                    return <Option value={attr}>{attr}</Option>;
                  })}
                </Select>
              </FormItem>
            </Form>

            {filter.filter((appliedFilter) => appliedFilter.type === 'node').length > 0 && (
              <h3 className={styles.subHeader}>Activate Node Filter</h3>
            )}

            <Form>
              {filter
                .filter((appliedFilter) => appliedFilter.type === 'node')
                .map((appliedFilter) => (
                  <AttributeFilter
                    minVal={appliedFilter.minVal}
                    maxVal={appliedFilter.maxVal}
                    range={appliedFilter.range}
                    attr={appliedFilter.attr}
                    type={appliedFilter.type}
                    onChange={this.changeFilterValue}
                    removeCb={this.removeFilter}
                  />
                ))}
            </Form>
            {filter.filter((appliedFilter) => appliedFilter.type === 'link').length > 0 && (
              <h3 className={styles.subHeader}>Activate Edge Filter</h3>
            )}

            <Form>
              {filter
                .filter((appliedFilter) => appliedFilter.type === 'link')
                .map((appliedFilter) => (
                  <AttributeFilter
                    minVal={appliedFilter.minVal}
                    maxVal={appliedFilter.maxVal}
                    range={appliedFilter.range}
                    attr={appliedFilter.attr}
                    type={appliedFilter.type}
                    onChange={this.changeFilterValue}
                    removeCb={this.removeFilter}
                  />
                ))}
            </Form>
          </div>
        </div>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    sidebar: state.sidebar,
    graph: state.events.graph,
    filter: state.filter,
  };
}

export default connect(
  mapStateToProps,
  { showNodeInfo, removeNode, changeRangeFilters, hideUnconnected }
)(FilterSideBar);
