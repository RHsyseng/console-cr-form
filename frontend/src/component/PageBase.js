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
import JSONPATH from "jsonpath";
import * as objJson from "./common/MultipleObjData";
import { OPERATOR_NAME } from "./common/GuiConstants";

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

  onChange = value => {
    console.log("onChange with value: " + value);
  };

  onChangeEmail = (value, event) => {
    //console.log("onChangeEmail: " + value);
    //console.log("handleEmailchange, event.target.name: " + event.target.name);
    //console.log("handleEmailchange, event.target.value: " +  event.target.value);

    if (value != null && value != "" && !validator.isEmail(value)) {
      console.log("not valid email address: " + value);
      this.setState({
        validationMessageEmail: "not valid email address"
      });
    } else {
      this.setState({
        validationMessageEmail: ""
      });
    }
  };

  onChangeUrl = (value, event) => {
    if (value != null && value != "" && !validator.isURL(value)) {
      console.log("not valid URL " + value);
      this.setState({
        validationMessageUrl: "not valid URL"
      });
    } else {
      this.setState({
        validationMessageUrl: ""
      });
    }
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

    var queryResults = JSONPATH.query(schema, jsonPath);
    console.log("queryResults " + JSON.stringify(queryResults[0]));

    return queryResults[0];
  }

  renderMultipleComponents = (label, operator, tempRenderJson) => {
    const objDef = objJson[operator + "_" + label];
    console.log(
      "!!!!!!!!!! renderComponents tempRenderJson objDefobjDef***: " +
        JSON.stringify(objDef)
    );
    //
    // var obj = JSON.parse(jsonStr);
    var x;
    let obj = objDef.fields;

    for (x in obj) {
      tempRenderJson.push(obj[x]);
      // jsonStr = JSON.stringify(obj);
    }
    this.state.children = [];
    //this.renderComponents(pageDef);
    return tempRenderJson;
  };

  onAddObject = () => {
    var x, currentFields, fields;
    currentFields = this.state.renderJson.fields;
    //  console.log("onAddObject is clicked****", currentFields);
    var tempRenderJson = [];

    for (x in currentFields) {
      fields = currentFields[x];
      tempRenderJson.push(fields);

      // if (fields.label === "Env") {
      if (fields.type == "object") {
        //   console.log("onAddObject is clicked****", fields.type);
        this.renderMultipleComponents(
          fields.label,
          OPERATOR_NAME,
          tempRenderJson
        );
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

  buildOneField(field, i) {
    //console.log("!!!!!!!!!! buildOneField i: " + i);
    const fieldId = "horizontal-form-" + field.label + i;
    const key = "key-" + field.label + i;
    const textName = "input" + i;

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
        <FormGroup label={field.label} fieldId={fieldId} helperText={helpText}>
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
        <FormGroup label={field.label} isRequired fieldId={fieldId} key={key}>
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
    } else if (field.type == "object") {
      fieldJsx = (
        <ActionGroup fieldid={fieldId}>
          <Button variant="primary" onClick={this.onAddObject}>
            Add {field.label}
          </Button>

          <Button variant="secondary" onClick={this.onDeleteObject}>
            Delete {field.label}
          </Button>
        </ActionGroup>
      );
    } else if (field.type == "email") {
      fieldJsx = (
        <FormGroup label={field.label} fieldId={fieldId} key={key}>
          <TextInput
            type="text"
            id="horizontal-form-email"
            name={textName}
            onChange={this.onChangeEmail}
          />
        </FormGroup>
      );
    } else if (field.type == "url") {
      fieldJsx = (
        <FormGroup label={field.label} fieldId={fieldId} key={key}>
          <TextInput
            type="text"
            id="horizontal-form-url"
            name={textName}
            onChange={this.onChangeUrl}
          />
        </FormGroup>
      );
    } else {
      fieldJsx = (
        <FormGroup label={field.label} fieldId={fieldId} key={key}>
          <TextInput
            isRequired
            type="text"
            id="horizontal-form-name"
            aria-describedby="horizontal-form-name-helper"
            name={textName}
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
