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
import validator from "validator";
import PageBase from "../PageBase";

export default class Page1 extends PageBase {
  state = {
    value: "please choose",
    pageDef: this.props.jsonForm.pages[0],
    children: [],
    validationMessageEmail: "",
    validationMessageUrl: ""
  };

  componentDidMount() {
    this.renderComponents(this.state.pageDef);
  }

  onChange = (value, event) => {
    //this.setState({ value });
    this.props.setValue4(value);
  };

  handleEmailchange = value1 => {
    console.log("handleEmailchange: " + value1);
    if (value1 != null && value1 != "" && !validator.isEmail(value1)) {
      console.log("not valid email address: " + value1);
      this.setState({
        validationMessageEmail: "not valid email address: "
      });
    } else {
      //        this.props.setValue1(value1);
      this.setState({
        validationMessageEmail: ""
      });
    }
  };

  handleUrlChange = value2 => {
    console.log("handleUrlChange: " + value2);
    if (value2 != null && value2 != "" && !validator.isURL(value2)) {
      console.log("not valid URL: " + value2);
      this.setState({
        validationMessageUrl: "not valid URL: "
      });
    } else {
      //this.props.setValue2(value2);
      this.setState({
        validationMessageUrl: ""
      });
    }
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
          label="Email"
          isRequired
          fieldId="horizontal-form-label1"
          helperText="Please provide correct email address"
        >
          <TextInput
            isRequired
            type="text"
            onChange={this.handleEmailchange}
            id="horizontal-form-field1"
            name="horizontal-form-field1"
          />
          <b>{this.state.validationMessageEmail}</b>
        </FormGroup>
        <FormGroup label="URL" isRequired fieldId="horizontal-form-label2">
          <TextInput
            isRequired
            type="text"
            onChange={this.handleUrlChange}
            id="horizontal-form-field2"
            name="horizontal-form-field2"
          />
          <b>{this.state.validationMessageUrl}</b>
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
