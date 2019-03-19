import React, { Component } from 'react';
import { connect } from 'react-redux';

import GraphView from 'containers/GraphView';
import Tools from 'containers/Tools';
import SideBar from 'components/SideBar';
import SearchBar from 'components/SearchBar';
// import SuggestModificationCard from 'components/SuggestModificationCard';
// import SnippetExplorer from 'components/SnippetExplorer';
// import {ToastContainer} from 'react-toastify';

import {
  clearGraph,
  fetchSuggestions,
  fetchNeighbours,
  fireCypherRequest,
  genNNodes,
  getNNodes,
  fetchMeta,
} from 'actions/apiActions';

import { removeLegendFilter } from 'actions/filterActions';

import 'flexboxgrid/dist/flexboxgrid.min.css';
import 'material-design-icons/iconfont/material-icons.css';
import 'd3-context-menu/css/d3-context-menu.css';
import './style.scss';
import ToolBar from 'components/ToolBar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarActive: true,
      editActive: false,
      snippetsActive: false,
      loading: false,
      lastSearchedWord: '',
      layouting: false,
      suggestions: [],
      showLabels: true,
    };
  }

  componentDidMount() {
    this.props.fetchMeta();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.lastSearchedWord !== '') {
      this.setState({ suggestions: nextProps.api.suggestions });
      if (nextProps.api.suggestions.searchKey === this.state.lastSearchedWord) {
        this.setState({ loading: false, lastSearchedWord: '' });
      }
    }
  }

  /**
   * toggles the boolean value of the state attribute @param prop
   * if @param value is a boolean the function sets the state attribute to the boolean
   * */
  toggleState = (prop, value) => {
    const newState = {};
    newState[prop] = typeof value === 'boolean' ? value : !this.state[prop];

    // if sidebar is shown hide the edit card
    if (prop === 'sidebarActive' && newState[prop]) {
      newState.editActive = false;
    }
    if (prop === 'editActive' && newState[prop]) {
      newState.sidebarActive = false;
    }

    this.setState(newState);
  };

  searchTyped = (word) => {
    if (word.length === 0) {
      this.setState({ suggestions: [] });
      return;
    }

    this.props.fetchSuggestions(word);
    this.setState({ loading: true, lastSearchedWord: word });
  };

  searchSubmitted = (suggestion) => {
    this.props.clearGraph();
    this.props.removeLegendFilter();

    console.log(suggestion);

    if (suggestion.type === 'Cypher') {
      this.props.fireCypherRequest(suggestion.query);
    } else if (suggestion.type === 'count') {
      this.props.getNNodes(suggestion.query);
    } else if (suggestion.type === 'gen') {
      this.props.genNNodes(suggestion.query.substring(8));
    } else {
      this.props.fetchNeighbours(suggestion.id);
    }
  };

  render() {
    return (
      <main>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic"
        />

        <ToolBar
          sidebarActive={this.state.sidebarActive}
          layouting={this.state.layouting}
          showLabels={this.state.showLabels}
          toggleState={this.toggleState}
        />

        <SideBar
          active={this.state.sidebarActive}
          toggleSideBar={() => this.toggleState('sidebarActive')}
          toggleEdit={() => this.toggleState('editActive')}
          showSnippets={() => this.toggleState('snippetsActive')}
        />

        <div style={{ zIndex: 999 }} className='search-bar'>
          <SearchBar
            suggestions={this.state.suggestions}
            searchTyped={this.searchTyped}
            searchSubmitted={this.searchSubmitted}
            loading={this.state.loading}
          />
        </div>

        {/*<SnippetExplorer active={this.state.snippetsActive}*/}
        {/*hideSnippets={this.toggleState.bind(this, 'snippetsActive')}/>*/}
        {/*<SuggestModificationCard active={this.state.editActive} toggleState={this.toggleState}/>*/}
        <GraphView
          layoutOff={() => this.setState({ layouting: false })}
          layouting={this.state.layouting}
          showLabels={this.state.showLabels}
          toggleSideBar={() => this.toggleState('sidebarActive', true)}
        />

        <Tools />
      </main>
    );
  }
}

function mapStateToProps(state) {
  return { api: state.api };
}

export default connect(
  mapStateToProps,
  {
    clearGraph,
    fetchSuggestions,
    fetchNeighbours,
    fireCypherRequest,
    getNNodes,
    genNNodes,
    fetchMeta,
    removeLegendFilter,
  }
)(App);
