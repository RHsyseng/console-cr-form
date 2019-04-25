import React from "react";

import { FormGroup, TextInput } from "@patternfly/react-core";

export class PasswordField {
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
          type="password"
          id={this.props.ids.fieldId}
          key={this.props.ids.fieldKey}
          name={this.props.fieldDef.label}
          //onChange={this.onChange}
          jsonpath={this.props.fieldDef.jsonPath}
        />
      </FormGroup>
    );
  }
}
