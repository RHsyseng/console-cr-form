import React, { Component } from "react";
import { Form } from "@patternfly/react-core";

import PageBase from "../PageBase";
import { MockupData_JSON } from "../common/MockupData";
import { EnvRender_JSON } from "../rhpam/EnvObjData";

export default class Page3 extends PageBase {
  constructor(props) {
    super(props);
    let envRenderDef = EnvRender_JSON;
    let pageDef = this.props.jsonForm.pages[2];
    if (pageDef == null) {
      console.log(
        "!!!!!jsonForm doesn't have this page, might be an error in loading the data, set to 1st page"
      );
      pageDef = this.props.jsonForm.pages[0];
    }

    this.state = {
      pageDef,
      children: [],
      envRenderDef,
      passedInJson: {},
      renderJson: {}
    };
  }

  componentDidMount() {
    //this.renderComponents(this.state.pageDef);

    var x, originalFields, y, fields;
    originalFields = this.state.pageDef.fields;
    console.log("onAddObject is clicked****", originalFields);
    var tempRenderJson = [];

    for (x in originalFields) {
      fields = originalFields[x];
      tempRenderJson.push(fields);
      if (fields.label === "Env") {
        console.log("minimum range::", fields.min);
        //}
        if (fields.min > 0) {
          var i = 0;
          while (i < fields.min) {
            this.renderMultipleComponents(fields, tempRenderJson);
            i++;
          }
          //}
        }
        console.log(
          "!!!!!!!!!! renderComponents tempRenderJson:::: " +
            JSON.stringify(tempRenderJson)
        );
        let newRenderJson = {
          fields: [{}],
          buttons: [{}]
        };
        console.log(
          "!!!!!!!!!! renderComponents newRenderJs+===== " +
            JSON.stringify(newRenderJson.fields)
        );
        newRenderJson = { ...newRenderJson, fields: tempRenderJson };
        newRenderJson = {
          ...newRenderJson,
          buttons: this.state.pageDef.buttons
        };

        console.log(
          "!!!!!!!!!! renderComponents newRenderJson:::: " +
            JSON.stringify(newRenderJson)
        );

        this.setState({
          passedInJson: newRenderJson,
          renderJson: newRenderJson
        });
        this.state.children = [];
        this.renderComponents(newRenderJson);
      }
    }
  }

  renderMultipleComponents = (fields, tempRenderJson) => {
    let fieldDef = {};
    //this.state.children = [];
    let buttonDef = {};
    let pageDef = this.state.pageDef;
    var envDef = this.state.envRenderDef;

    // var obj = JSON.parse(jsonStr);
    var x;
    let obj = envDef.fields;

    for (x in obj) {
      tempRenderJson.push(obj[x]);
      // jsonStr = JSON.stringify(obj);
    }
    console.log(
      "!!!!!!!!!! renderComponents tempRenderJson***: " +
        JSON.stringify(tempRenderJson)
    );
    //this.state.children = [];
    //this.renderComponents(pageDef);
    return tempRenderJson;
  };

  onAddObject = () => {
    var x, currentFields, y, fields;
    currentFields = this.state.renderJson.fields;
    console.log("onAddObject is clicked****", currentFields);
    var tempRenderJson = [];

    for (x in currentFields) {
      fields = currentFields[x];
      tempRenderJson.push(fields);

      if (fields.label === "Env") {
        console.log("onAddObject is clicked****", fields.min);

        this.renderMultipleComponents(fields, tempRenderJson);
      }
      console.log(
        "!!!!!!!!!! renderComponents tempRenderJson:::: " +
          JSON.stringify(tempRenderJson)
      );
      let newRenderJson = {
        fields: [{}],
        buttons: [{}]
      };
      console.log(
        "!!!!!!!!!! renderComponents newRenderJs+===== " +
          JSON.stringify(newRenderJson.fields)
      );
      newRenderJson = { ...newRenderJson, fields: tempRenderJson };
      newRenderJson = {
        ...newRenderJson,
        buttons: this.state.pageDef.buttons
      };

      console.log(
        "!!!!!!!!!! renderComponents newRenderJson:::: " +
          JSON.stringify(newRenderJson)
      );

      this.setState({ renderJson: newRenderJson });
      this.state.children = [];
      this.renderComponents(newRenderJson);
    }
  };
  onDeleteObject = () => {
    console.log(
      "!!!!!!!!!! renderComponents newRenderJson:::: " +
        JSON.stringify(this.state.renderJson)
    );

    var tempRenderJson = this.state.renderJson;

    var deletedItem = tempRenderJson.fields.splice(
      tempRenderJson.fields.length - 2,
      2
    );
    this.setState({ renderJson: tempRenderJson });
    this.state.children = [];
    this.renderComponents(tempRenderJson);
  };

  onChange = (_, event) => {
    console.log("onChange", event.target.name, event.target.value);
    // this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    return (
      <Form isHorizontal key="page-form2">
        {this.state.children}
      </Form>
    );
  }
}
