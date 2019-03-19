import React, { Component } from "react";

import styles from "./styles.scss";
import ModificationableItem from "./ModicifationableItem";

import _ from "lodash";

class SuggestModification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            model: _.clone(props.obj.props),
            updatedModel: {},
            id: props.obj.id
        };
    }

    // update this.state[field] with value
    editValue = (field, value) => {
        let model = this.state.model;
        model[field] = value;

        let updatedModel = this.state.updatedModel;
        updatedModel[field] = value.toString();

        this.setState({ model, updatedModel });
        this.props.updateEditModel(this.state.id, model, updatedModel);
    };

    componentWillReceiveProps(nextProps) {
        if(this.props.obj.id === nextProps.obj.id) return;

        this.setState({ model: _.clone(nextProps.obj.props), id: nextProps.obj.id });
    }

    render() {
        return (
          <div>
              <h3 className={styles.subHeader}>
                  Änderungen vorschlagen
              </h3>
              {Object.keys(this.state.model).map((label, i) => {
                  if (label.toLowerCase() === "id") return "";
                  if (label.toLowerCase() === "__cover") return "";
                  if (label.toLowerCase() === "__hasdetails") return "";
                  if (label.toLowerCase() === "__size") return "";
                  if (label.toLowerCase() === "name") return "";
                  if (label.toLowerCase() === "degree") return "";

                  return (
                    <span key={i}>
                <ModificationableItem label={label} value={this.state.model[label]} onChange={this.editValue}/>
              </span>
                  );
              })}
          </div>
        );
    }
}

export default SuggestModification;
