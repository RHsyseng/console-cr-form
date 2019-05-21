import React from "react";
import { FormGroup, TextInput, Tooltip } from "@patternfly/react-core";

export class DefaultTextField {
  constructor(props) {
    this.props = props;
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
            onChange={this.onChangeText}
            jsonpath={this.props.fieldDef.jsonPath}
            placeholder={this.props.fieldDef.default}
            defaultValue={this.props.fieldDef.value}
            {...this.props.attrs}
          />
        </Tooltip>
      </FormGroup>
    );
  }
  onChangeText = value => {
    if (value !== undefined && value !== null) {
      this.props.fieldDef.value = value;
      this.isValidField();
    }
  };

  isValidField() {
    const value = this.props.fieldDef.value;
    if (
      this.props.fieldDef.required === true &&
      (value === undefined || value === "")
    ) {
      this.errMsg = this.props.fieldDef.label + " is required.";

      this.isValid = false;
    } else {
      this.errMsg = "";
      this.isValid = true;
    }
    this.props.fieldDef.errMsg = this.errMsg;
  }
}
