import React, { Component } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import InfoSideBar from './InfoSideBar';
import FilterSideBar from './FilterSideBar';
import SearchSideBar from './SearchSideBar';
import GraphSideBar from './GraphSideBar';

import ReactSidebar from 'react-sidebar';
import { Button, Card } from 'antd';

import styles from './styles.module.scss';

class SideBar extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    toggleEdit: PropTypes.bool.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    const { active, sidebar } = this.props;

    if (sidebar !== nextProps.sidebar && !active && !nextProps.active) {
      this.props.toggleSideBar();
    }
  }

  close = () => {
    this.props.toggleSideBar();
  };

  render() {
    const { active, toggleEdit, sidebar, searchBarComponent } = this.props;

    let sidebarView = '';

    console.log(`Sidebar: ${sidebar.currentView}`);

    if (sidebar.currentView === 'info') {
      sidebarView = <InfoSideBar toggleEdit={toggleEdit} toggleSideBar={this.close} />;
    }
    if (sidebar.currentView === 'filter') {
      sidebarView = <FilterSideBar toggleSideBar={this.close} />;
    }
    if (sidebar.currentView === 'search') {
      sidebarView = (
        <SearchSideBar searchBarComponent={searchBarComponent} toggleSideBar={this.close} />
      );
    }
    if (sidebar.currentView === 'graph') {
      sidebarView = <GraphSideBar toggleSideBar={this.close} />;
    }

    return (
      <div>
        <ReactSidebar
          id="sidebar"
          // className={`${styles.bar}`}
          styles={{
            sidebar: {
              marginLeft: '60px',
              width: '348px',
              overflowX: 'visible',
              overflowY: 'visible',
              backgroundColor: 'white',
            },
          }}
          docked={active}
          sidebar={
            <div>
              <Card className={styles.close_button_panel}>
                <Button
                  icon={active ? 'left' : 'right'}
                  onClick={this.close}
                  className={styles.close_button}
                />
              </Card>
              <div className={styles.fullSideBar}>{sidebarView}</div>
            </div>
          }
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { sidebar: state.sidebar };
}

export default connect(
  mapStateToProps,
  {}
)(SideBar);
