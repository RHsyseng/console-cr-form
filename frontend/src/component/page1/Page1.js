import React, { Component } from 'react';
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
} from '@patternfly/react-core';


export default class Page1 extends Component {
    state = {
        value: 'please choose',

      };

      onChange = (value, event) => {
        //this.setState({ value });
        this.props.setValue4(value);
      };

      handleTextInputChange1 = value1 => {
        this.props.setValue1(value1);
      };

      handleTextInputChange2 = value2 => {
        this.props.setValue2(value2);
      };

      handleTextInputChange3 = value3 => {
          this.props.setValue3(value3);
      };

      options = [
        { value: 'please choose', label: 'Please Choose', disabled: false },
        { value: 'app1', label: 'application 1', disabled: false },
        { value: 'app2', label: 'application 2', disabled: false },
        { value: 'app3', label: 'application 3', disabled: false },
        { value: 'other', label: 'other application ', disabled: false }
      ];

      render() {
        const { value1, value2, value3 } = this.props;

        return (
          <Form isHorizontal>
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
                  <FormSelectOption isDisabled={option.disabled} key={index} value={option.value} label={option.label} />
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
            <FormGroup label="Other?" fieldId="horizontal-radio1">
              <Radio label="Yes" aria-label="yes" id="horizontal-radio1" name="horizontal-radios" />
              <Radio label="No" aria-label="no" id="horizontal-radio2" name="horizontal-radios" />
            </FormGroup>

          </Form>
        );
      }
}
