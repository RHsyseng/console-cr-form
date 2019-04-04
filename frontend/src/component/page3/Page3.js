import React from "react";
import { Form } from "@patternfly/react-core";

import PageBase from "../PageBase";

//import * as objJson from "../common/MultipleObjData";
import { OPERATOR_NAME } from "../common/GuiConstants";
export default class Page3 extends PageBase {
  constructor(props) {
    super(props);
    let envRenderDef = "";
    let pageDef = this.props.jsonForm.pages[2];
    let children = this.props.children;
    if (pageDef == null) {
      console.log(
        "!!!!!jsonForm doesn't have this page, might be an error in loading the data, set to 1st page"
      );
      pageDef = this.props.jsonForm.pages[0];
    }

    this.state = {
      pageDef,
      children,
      envRenderDef,
      passedInJson: {},
      renderJson: {}
    };
  }

  componentDidMount() {
    //this.renderComponents(this.state.pageDef);
    var x, originalFields, fields;
    originalFields = this.state.pageDef.fields;
    //  console.log("compDef is clicked****", originalFields);
    var tempRenderJson = [];

    for (x in originalFields) {
      fields = originalFields[x];
      tempRenderJson.push(fields);
      if (fields.type === "object") {
        console.log("minimum range::", fields.min);
        //}
        if (fields.min > 0) {
          var i = 0;
          while (i < fields.min) {
            this.renderMultipleComponents(
              fields.label,
              OPERATOR_NAME,
              tempRenderJson
            );
            i++;
          }
        }
      }
      // console.log(
      //   "!!!!!!!!!! renderComponents tempRenderJson:::: " +
      //     JSON.stringify(tempRenderJson)
      // );
      let newRenderJson = {
        fields: [{}],
        buttons: [{}]
      };
      // console.log(
      //   "!!!!!!!!!! renderComponents newRenderJs+===== " +
      //     JSON.stringify(newRenderJson.fields)
      // );
      newRenderJson = { ...newRenderJson, fields: tempRenderJson };
      newRenderJson = {
        ...newRenderJson,
        buttons: this.state.pageDef.buttons
      };

      // console.log(
      //   "!!!!!!!!!! renderComponents newRenderJson:::: " +
      //     JSON.stringify(newRenderJson)
      // );

      this.setState({
        passedInJson: newRenderJson,
        renderJson: newRenderJson
      });
      this.state.children = [];
      this.renderComponents(newRenderJson);
    }
  }

  onChange = (_, event) => {
    console.log("onChange", event.target.name, event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <Form isHorizontal key="page-form2">
        {this.state.children}
      </Form>
    );
  }
}
