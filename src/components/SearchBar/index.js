import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AutoComplete, Icon, Input } from 'antd';
import styles from './styles.module.scss';

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = { searchQuery: '' };
  }

  handleSearchChange = (value) => {
    this.setState({
      searchQuery: value,
    });
    this.props.searchTyped(value);
  };

  submitSearch = (suggestionId) => {
    let suggestion;

    this.props.suggestions.every((option) => {
      if (option.id === suggestionId) {
        suggestion = option;
        return false;
      }

      return true;
    });

    if (suggestion) {
      this.props.searchSubmitted(suggestion);

      if (suggestion.type === 'Cypher') {
        this.setState({ searchQuery: `elex:${suggestion.query}` });
      } else if (suggestion.type === 'DSL') {
        this.setState({ searchQuery: suggestion.query });
      } else if (suggestion.type === 'count') {
        this.setState({ searchQuery: suggestion.query });
      } else if (suggestion.type === 'gen') {
        this.setState({ searchQuery: suggestion.query });
      } else {
        this.setState({ searchQuery: suggestion.name });
      }
    }
  };

  submit = (value, option) => {
    console.log(value, option);
    this.submitSearch(option.key);
  };

  clearSearch = () => {
    this.setState({ searchQuery: '' });
    this.props.searchTyped('');
  };

  render() {
    const { searchQuery } = this.state;
    const { suggestions, config } = this.props;

    const dataSource = [];

    if (suggestions.length > 0) {
      for (let i = 0; i <= 10; i += 1) {
        const opt = suggestions[i];
        if (opt) {
          dataSource.push(
            <Option key={opt.id} value={opt.name}>
              <i className={`material-icons ${styles.optionIcon}`}>{config.getIcon(opt.type)}</i>
              <i className={styles.optionText}>{opt.name}</i>
            </Option>
          );
        }
      }
    }

    return (
      <div>
        <AutoComplete
          size="large"
          value={searchQuery}
          className={styles.card}
          dataSource={dataSource}
          onSearch={this.handleSearchChange}
          onSelect={this.submit}
          optionLabelProp="value"
        >
          <Input suffix={<Icon type="search" />} />
        </AutoComplete>
      </div>
      //     <ProgressBar
      //       style={{ zIndex: 9999 }}
      //       className={this.props.loading === false ? styles.hide : ''}
      //       type="linear"
      //       mode="indeterminate"
      //     />
    );
  }
}

function mapStateToProps(state) {
  return {
    config: state.config,
  };
}

export default connect(mapStateToProps)(SearchBar);
