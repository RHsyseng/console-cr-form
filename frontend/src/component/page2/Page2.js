import React, { Component } from 'react';
import { Form } from "@patternfly/react-core";

import PageBase from "../PageBase";


export default class Page2 extends PageBase {
  constructor(props) {
    super(props);

    let pageDef = this.props.jsonForm.pages[1];
    if (pageDef == null){
        console.log("!!!!!jsonForm doesn't have this page, might be an error in loading the data or defining the page, set to 1st page");
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


  onChange = (value) => {
    console.log("onChange in page2, value : " + value);
    this.props.setName(value);
  };


  render() {
    return <Form isHorizontal>{this.state.children}</Form>;
  }
}
