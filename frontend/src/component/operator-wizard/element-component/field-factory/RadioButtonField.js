import React from "react";

import { FormGroup, Radio } from "@patternfly/react-core";

export class RadioButtonField {
  constructor(props) {
    this.props = props;
    this.handleChangeRadio = this.handleChangeRadio.bind(this);
  }

  getJsx() {
    return (
      <FormGroup
        fieldId={this.props.ids.fieldGroupId}
        key={this.props.ids.fieldGroupKey}
      >
        <Radio
          key={this.props.ids.fieldKey}
          defaultValue={this.props.fieldDef.label}
          onChange={this.handleChangeRadio}
          name={this.props.parentid}
          isChecked={this.props.fieldDef.value}
          label={this.props.fieldDef.label}
          id={this.props.fieldDef.label}
        />
      </FormGroup>
    );
  }

  handleChangeRadio() {
    //const value = event.currentTarget.value;
    // this.isCheckedRadio = !this.isCheckedRadio;

    let count = 0,
      len = 0;
    this.props.page.props.pageDef.fields.forEach(field => {
      if (field.label === this.props.parentid) {
        len = field.fields.length;
        field.fields.forEach(subfield => {
          if (subfield.label !== this.props.fieldDef.label) {
            count = subfield.fields.length;
            subfield.value = false;
          } else {
            subfield.value = true;
          }
        });
      } // );
    });

    //removed
    this.props.page.props.pageDef.fields.splice(len, count);

    //  add
    this.props.fieldDef.fields.forEach((field, i) => {
      this.props.page.props.pageDef.fields.splice(len - 1 + i, i + 1, field);
    });
    //   debugger;
    this.props.page.loadPageChildren();
  }
}
