import React from "react";
import validator from "validator";
import { FormGroup, TextInput, Tooltip } from "@patternfly/react-core";

export class UrlField {
  constructor(props) {
    this.props = props;
    this.onBlurText = this.onBlurUrl.bind(this);
    this.errMsg = "";
    this.isValid = true;
  }

  getJsx() {
    this.isValidField();

    return (
      <FormGroup
        label={this.props.fieldDef.label}
        fieldId={this.props.ids.fieldGroupId}
        key={this.props.ids.fieldGroupKey}
        helperTextInvalid={this.errMsg}
        isValid={this.isValid}
        isRequired={this.props.fieldDef.required}
      >
        <Tooltip
          position="left"
          content={<div>{this.props.fieldDef.description}</div>}
          enableFlip={true}
          style={{
            display:
              this.props.fieldDef.description !== undefined &&
              this.props.fieldDef.description !== ""
                ? "block"
                : "none"
          }}
        >
          <TextInput
            type="text"
            id={this.props.ids.fieldId}
            key={this.props.ids.fieldKey}
            aria-describedby="horizontal-form-name-helper"
            name={this.props.fieldDef.label}
            // onChange={this.onChangeText}
            onBlur={this.onBlurUrl}
            jsonpath={this.props.fieldDef.jsonPath}
            defaultValue={this.props.fieldDef.value}
            placeholder={this.props.fieldDef.defaut}
            {...this.props.attrs}
          />
        </Tooltip>
      </FormGroup>
    );
  }

  onBlurUrl = event => {
    let value = event.target.value;
    if (value !== undefined && value !== null) {
      this.props.fieldDef.value = value;
      this.isValidField();
    }
    this.props.page.loadPageChildren();
  };

  isValidField() {
    const value = this.props.fieldDef.value;
    if (
      this.props.fieldDef.required === true &&
      (value === undefined || value === "")
    ) {
      this.errMsg = this.props.fieldDef.label + " is required.";
      this.isValid = false;
    } else if (value !== "" && !validator.isURL(value)) {
      this.errMsg = value + " is not a valid URL.";
      this.isValid = false;
    } else {
      this.errMsg = "";
      this.isValid = true;
    }
  }
}
