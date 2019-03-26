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

import JSONPATH from "jsonpath";

//import { MockupData_JSON_SCHEMA } from "./common/MockupData";

export default class PageBase extends Component {
  onSubmit = () => {
    console.log("onSubmit is clicked");
    alert("onSubmit is clicked");
  };

  onCancel = () => {
    console.log("onCancel is clicked");
    alert("onCancel is clicked");
  };

  onNext = () => {
    console.log("onNext is clicked");
    alert("onNext is clicked");
  };

  onClose = () => {
    console.log("onClose is clicked");
    alert("onClose is clicked");
  };

  onChange = (value) => {
    console.log("onChange with value: " + value);
  };

  renderComponents = pageDef => {
    //const pageDef = MockupData_JSON.pages[1];
    //console.log("!!!!!!!!!! renderComponents pageDef2: " + JSON.stringify(pageDef));

    var children = [];

    //generate all fields
    if (pageDef.fields != null && pageDef.pageDef != "") {
      //loop through all fields
      pageDef.fields.forEach((field, i) => {
        //        console.log("!!!!!!!!!! field: " + JSON.stringify(field));
        const oneComponent = this.buildOneField(field, i);

        //        console.log("!!!!!!!!!! oneComponent build: " + oneComponent);
        //console.log("!!!!!!!!!! oneComponent build2: " + ReactDOMServer.renderToString(oneComponent) );
        children.push(oneComponent);
      });
    }

    //generate all buttons
    if (pageDef.buttons != null && pageDef.buttons != "") {
      const buttonsComponent = this.buildAllButtons(pageDef.buttons);
      children.push(buttonsComponent);
    }

    this.setState({
      children: [this.state.children, children]
    });
  };

  findValueFromSchema(jsonPath) {
    const schema = this.props.jsonSchema;
    //const values = schema.properties.spec.properties.environment.enum;
    //console.log("values " + JSON.stringify(values));

    console.log("jsonPath: " + jsonPath);
    //passed in: $.spec.environment
    //jsonPath = "$..spec.properties.environment.enum";

    var queryResults = JSONPATH.query(schema,jsonPath);
    console.log("queryResults " + JSON.stringify(queryResults[0]));

    return queryResults[0];
  }

  buildOneField(field, i) {
    //console.log("!!!!!!!!!! buildOneField i: " + i);
    const fieldId = "horizontal-form-" + field.label + i;
    const key = "key-" + field.label + i;

    var fieldJsx = "";
    if (field.type == "dropDown") {
      var options = [];
      const optionValues = this.findValueFromSchema(field.jsonPath);
      optionValues.forEach((option, i) => {
        const oneOption = {
          label: option,
          value: option
        };
        options.push(oneOption);
      });


      const tmpJsonPath = "$..spec.properties.environment.description";
      const helpText = this.findValueFromSchema(tmpJsonPath);

      fieldJsx = (
        <FormGroup label={field.label} fieldId={fieldId}
helperText={helpText}

        >
          <FormSelect id="horzontal-form-title" name="horizontal-form-title">
            {options.map((option, index) => (
              <FormSelectOption
                isDisabled={option.disabled}
                key={index}
                value={option.value}
                label={option.label}
              />
            ))}
          </FormSelect>
        </FormGroup>
      );
    } else if (field.type == "textArea") {
      fieldJsx = (
        <FormGroup
          label={field.label}
          isRequired
          fieldId={fieldId}
          key={key}
        >
          <TextArea
            value={field.default}
            name="horizontal-form-exp"
            id="horizontal-form-exp"
            key={key}
          />
        </FormGroup>
      );
    } else if (field.type == "radioButton") {
      fieldJsx = (
        <FormGroup label={field.label} fieldId="horizontal-radio1" key={key}>
          <Radio
            label="Yes"
            aria-label="yes"
            id="horizontal-radio1"
            name="horizontal-radios"
          />
          <Radio
            label="No"
            aria-label="no"
            id="horizontal-radio2"
            name="horizontal-radios"
          />
        </FormGroup>
      );
    } else {
      fieldJsx = (
        <FormGroup
          label={field.label}
          isRequired
          fieldId={fieldId}
          key={key}
        >
          <TextInput
            isRequired
            type="text"
            id="horizontal-form-name"
            aria-describedby="horizontal-form-name-helper"
            name="horizontal-form-name"
            onChange={this.onChange}
          />
        </FormGroup>
      );
    }

    return fieldJsx;
  }

  buildAllButtons(buttons) {
    //console.log("!!!!!!!!!! buildAllButtons: " + JSON.stringify(buttons));
    var buttonsJsx = [];
    //loop through all
    buttons.forEach((button, i) => {
      //console.log("!!!!!!!!!! button: " + JSON.stringify(button));
      //console.log("!!!!!!!!!! button, i: " + i);

      //const oneComponent = this.buildOneButton(button, i);

      const key = "form-key-" + button.label + i;

      var buttonJsx = "";
      if (button.action != null && button.action == "submit") {
        buttonJsx = (
          <Button variant="primary" key={key} onClick={this.onSubmit}>
            {button.label}
          </Button>
        );
      } else if (button.action != null && button.action == "cancel") {
        buttonJsx = (
          <Button variant="secondary" key={key} onClick={this.onCancel}>
            {button.label}
          </Button>
        );
      } else if (button.action != null && button.action == "next") {
        buttonJsx = (
          <Button variant="secondary" key={key} onClick={this.onNext}>
            {button.label}
          </Button>
        );
      } else if (button.action != null && button.action == "close") {
        buttonJsx = (
          <Button variant="secondary" key={key} onClick={this.onClose}>
            {button.label}
          </Button>
        );
      }

      buttonsJsx.push(buttonJsx);
    });

    return <ActionGroup>{buttonsJsx}</ActionGroup>;
  }
}
