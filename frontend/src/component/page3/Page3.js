import React, { Component } from "react";
import { Form } from "@patternfly/react-core";

import PageBase from "../PageBase";
import { MockupData_JSON } from "../common/MockupData";

export default class Page3 extends PageBase {
  constructor(props) {
    super(props);

    let pageDef = this.props.jsonForm.pages[2];
    if (pageDef == null){
        console.log("!!!!!jsonForm doesn't have this page, might be an error in loading the data, set to 1st page");
        pageDef = this.props.jsonForm.pages[0];
    }

    this.state = {
        pageDef,
      children: []
    };
  }

  componentDidMount() {
    this.renderComponents(this.state.pageDef);
  }

  render() {
    return <Form isHorizontal key="page-form2">{this.state.children}</Form>;
  }
}
