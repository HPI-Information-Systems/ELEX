import React, { Component } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { Card } from 'antd';
import { fetchMeta, setLinkTypes, setNodeTypes } from 'actions/apiActions';
import styles from './searchSideBar.module.scss';

class SearchSideBar extends Component {
  static propTypes = { meta: PropTypes.object };

  static defaultProps = { meta: {} };

  handleNodeTypeChange = (value) => {
    this.props.setNodeTypes(value);
  };

  handleLinkTypeChange = (value) => {
    this.props.setLinkTypes(value);
  };

  render() {
    const { meta } = this.props;

    const showAutoComplete =
      meta &&
      meta.nodeTypes &&
      meta.nodeTypes.length > 0 &&
      meta.linkTypes &&
      meta.linkTypes.length > 0;

    // const nodeComplete = (
    //   <Autocomplete
    //     direction="down"
    //     onChange={this.handleNodeTypeChange}
    //     label="Choose Node Types"
    //     source={this.props.meta ? this.props.meta.nodeTypes : []}
    //     value={this.props.requestParams ? this.props.requestParams.nodeTypes : ''}
    //   />
    // );
    //
    // const linkComplete = (
    //   <Autocomplete
    //     direction="down"
    //     onChange={this.handleLinkTypeChange}
    //     label="Choose Edge Types"
    //     source={this.props.meta ? this.props.meta.linkTypes : []}
    //     value={this.props.requestParams ? this.props.requestParams.linkTypes : ''}
    //   />
    // );
    //
    // const autocompleteOptions = (
    //   <div className={styles.sidebar_scroll}>
    //     {showAutoComplete ? (
    //       <div>
    //         {nodeComplete}
    //         {linkComplete}
    //       </div>
    //     ) : (
    //       ''
    //     )}
    //   </div>
    // );

    return (
      <Card className={`${styles.card}`}>
        <div className={`${styles.card_title}`}>
          <h2>Search for Nodes</h2>
          <div className={`${styles.search_bar}`}>{this.props.searchBarComponent}</div>
        </div>
        {/* {autocompleteOptions} */}
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    meta: state.config.meta,
    requestParams: state.api.requestParams,
  };
}

export default connect(
  mapStateToProps,
  { fetchMeta, setLinkTypes, setNodeTypes }
)(SearchSideBar);
