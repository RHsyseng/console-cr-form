import React from "react";
import { FormGroup, TextInput } from "@patternfly/react-core";

export class DefaultTextField {
  constructor(props) {
    this.props = props;
  }

  getJsx() {
    return (
      <FormGroup
        label={this.props.fieldDef.label}
        fieldId={this.props.ids.fieldGroupId}
        key={this.props.ids.fieldGroupKey}
      >
        <TextInput
          isRequired
          type="text"
          id={this.props.ids.fieldId}
          key={this.props.ids.fieldKey}
          aria-describedby="horizontal-form-name-helper"
          name={this.props.fieldDef.label}
          //onChange={this.onChange}
          jsonpath={this.props.fieldDef.jsonPath}
          {...this.props.attrs}
        />
      </FormGroup>
    );
  }
}
