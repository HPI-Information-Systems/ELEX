import React, { Component } from 'react';
import { connect } from 'react-redux';

import { notification, Card } from 'antd';

import styles from './infoSideBar.module.scss';
import ToolboxElement from './ToolboxElement';
import InfoCard from './InfoCard';
// import SuggestModificationCard from './SuggestModificationCard';

import { showNodeInfo } from 'actions/sidebarActions';
import { fetchLinkDetails, fetchNodeDetails, sendFeedback } from 'actions/apiActions';
import { changeNode, changeNodeTmp, removeNode } from 'actions/suggestionActions';

class InfoSideBar extends Component {
  constructor(props) {
    super(props);

    this.state = { showFull: false, showEdit: false, edit: {} };
  }

  deleteNode = () => {
    this.props.removeNode(this.props.sidebar.obj.id);
    this.props.showNodeInfo({ id: null, props: {} });
    this.props.toggleSideBar();
  };

  fetchDetails = () => {
    if (this.isNode()) {
      this.props.fetchNodeDetails(this.props.sidebar.obj.id);
    } else {
      this.props.fetchLinkDetails(this.props.sidebar.obj.id);
    }
    this.setState({ showFull: true });
  };

  toggleEdit = () => {
    this.setState({ showEdit: !this.state.showEdit });
    this.props.changeNodeTmp(this.state.edit.id, null);
  };

  updateEditModel = (id, model, updatedModel) => {
    this.props.changeNodeTmp(id, model);
    this.setState({ edit: { id: id, model: model, updatedModel } });
  };

  saveSuggestions = () => {
    this.props.changeNode(this.state.edit.id, this.state.edit.model);
    this.props.showNodeInfo({
      id: this.state.edit.id,
      props: this.state.edit.model,
    });
    this.props.sendFeedback('update', 'default-user', {
      ...this.state.edit.updatedModel,
      id: this.state.edit.id.toString(),
      node: this.isNode().toString(),
      edge: (!this.isNode()).toString(),
    });
    notification.success({ message: 'Suggestions are temporary saved' });
    this.toggleEdit();
  };

  closeFullSize = () => {
    this.setState({ showFull: false });
  };

  cover = (binary) => <img className={styles.cover} src={`${binary}`} alt="" />;

  isNode = () => {
    return this.props.sidebar.type === 'node';
  };

  render() {
    const obj = this.props.sidebar.obj;

    console.log(this.props);
    console.log(obj);

    const renderLinkName = (link) => {
      if (link.source && link.target) {
        return `[${obj.type}] ${obj.source.props.__label} -> ${obj.target.props.__label}`;
      }
      return `[${obj.type}]`;
    };

    return (
      <Card className={`${styles.card}`}>
        <div className={`${styles.card_title}`}>
          <h2>{this.isNode() ? obj.props.__label : renderLinkName(obj)}</h2>
        </div>
        {obj.props.__cover ? this.cover(obj.props.__cover) : ''}
        {this.state.showEdit ? (
          <div className={styles.card_toolbox}>
            <ToolboxElement icon="close" text="Cancel" onClick={this.toggleEdit} />
            <ToolboxElement icon="save" text="Save" onClick={this.saveSuggestions} />
          </div>
        ) : (
          <div className={styles.card_toolbox}>
            <ToolboxElement icon="edit" text="Edit" onClick={this.toggleEdit} disabled/>
            <ToolboxElement icon="delete" text="Remove" onClick={this.deleteNode} />
            <ToolboxElement
              icon="info"
              text="Details"
              onClick={this.fetchDetails}
              disabled={!obj.props.__hasDetails}
            />
          </div>
        )}
        <div className={styles.sidebar_scroll}>
          {this.state.showEdit ? (
            {/*<SuggestModificationCard obj={obj} updateEditModel={this.updateEditModel} />*/}
          ) : (
            <InfoCard obj={obj} />
          )}
        </div>
      </Card>

      // <NavDrawer
      //       id="info-full-sidebar"
      //       className={`${styles.bar}`}
      //       pinned={this.state.showFull}
      //     >
      //       <Card className={styles.card}>
      //         <IconButton
      //           className={styles.close_button}
      //           icon="close"
      //           ripple
      //           onClick={this.closeFullSize}
      //         />
      //         <div className={styles.card_title}>
      //           <CardTitle>Detailansicht</CardTitle>
      //         </div>
      //
      //         <div className={styles.card_full}>
      //           {obj.id === this.props.details.id &&
      //           this.props.sidebar.type === this.props.details.type ? (
      //             <div
      //               className={styles.details_scroll}
      //               dangerouslySetInnerHTML={{
      //                 __html: this.props.details.page,
      //               }}
      //             />
      //           ) : (
      //             <h3>Lade Details..</h3>
      //           )}
      //         </div>
      //       </Card>
      //     </NavDrawer>
    );
  }
}

function mapStateToProps(state) {
  return {
    sidebar: state.sidebar,
    details: state.api.details,
  };
}

export default connect(
  mapStateToProps,
  {
    showNodeInfo,
    removeNode,
    fetchNodeDetails,
    fetchLinkDetails,
    changeNode,
    changeNodeTmp,
    sendFeedback,
  }
)(InfoSideBar);
