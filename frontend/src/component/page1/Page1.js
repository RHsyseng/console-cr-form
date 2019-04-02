import React, { Component } from "react";
import {
  FormGroup,
  TextInput,
  TextArea,
  Form,
  FormSelectOption,
  FormSelect,
  Radio,
  Button,
  ActionGroup,
  Checkbox
} from "@patternfly/react-core";

import PageBase from "../PageBase";

export default class Page1 extends PageBase {
  state = {
    value: "please choose",
    pageDef: this.props.jsonForm.pages[0],
    children: []
  };

  componentDidMount() {
    this.renderComponents(this.state.pageDef);
  }

  onChange = (value, event) => {
    //this.setState({ value });
    this.props.setValue4(value);
  };

  handleTextInputChange1 = value1 => {
    console.log("handleTextInputChange1" + value1);
    this.props.setValue1(value1);
  };

  handleTextInputChange2 = value2 => {
    this.props.setValue2(value2);
  };

  handleTextInputChange3 = value3 => {
    this.props.setValue3(value3);
  };

  handleFlagChange = (_, event) => {
    console.log("clicked on handleFlagChange" + event.currentTarget.value);
  };

  options = [
    { value: "please choose", label: "Please Choose", disabled: false },
    { value: "app1", label: "application 1", disabled: false },
    { value: "app2", label: "application 2", disabled: false },
    { value: "app3", label: "application 3", disabled: false },
    { value: "other", label: "other application ", disabled: false }
  ];

  render() {
    const { value1, value2, value3 } = this.props;

    return (
      <Form isHorizontal>
        <FormGroup label="testRadio" fieldId="horizontal-radio1">
          <Radio
            label="Yes"
            aria-label="yes"
            id="horizontal-radio1"
            name="horizontal-radios"
            value="true"
            onChange={this.handleFlagChange}
          />
          <Radio
            label="false"
            aria-label="false"
            id="horizontal-radio2"
            name="horizontal-radios"
            value="false"
            onChange={this.handleFlagChange}
          />
        </FormGroup>

        <FormGroup
          label="API Version"
          isRequired
          fieldId="horizontal-form-name"
          helperText="Please provide correct version"
        >
          <TextInput
            isRequired
            type="text"
            id="horizontal-form-name"
            aria-describedby="horizontal-form-name-helper"
            name="horizontal-form-name"
            value={this.props.value1}
            onChange={this.handleTextInputChange1}
          />
        </FormGroup>
        <FormGroup label="Kind" isRequired fieldId="horizontal-form-email">
          <TextInput
            value={this.props.value2}
            onChange={this.handleTextInputChange2}
            isRequired
            type="email"
            id="horizontal-form-email"
            name="horizontal-form-email"
          />
        </FormGroup>
        <FormGroup label="Application Name" fieldId="horizontal-form-title">
          <FormSelect
            value={this.props.value4}
            onChange={this.onChange}
            id="horzontal-form-title"
            name="horizontal-form-title"
          >
            {this.options.map((option, index) => (
              <FormSelectOption
                isDisabled={option.disabled}
                key={index}
                value={option.value}
                label={option.label}
              />
            ))}
          </FormSelect>
        </FormGroup>
        <FormGroup label="Environment" fieldId="horizontal-form-exp">
          <TextArea
            value={this.props.value3}
            onChange={this.handleTextInputChange3}
            name="horizontal-form-exp"
            id="horizontal-form-exp"
          />
        </FormGroup>

        {this.state.children}
      </Form>
    );
  }
}
