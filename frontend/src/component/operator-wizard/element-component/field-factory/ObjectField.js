import React from "react";
import { ActionGroup, Button } from "@patternfly/react-core";
import FieldFactory from "./FieldFactory";

/**
 * These are the complex objects that need to create new childs.
 */
export class ObjectField {
  /**
   * How many times we've added an element chunk
   */
  elementAddCount = 0;
  /**
   * How many elements we're adding each time
   */
  elementChunkCount = 0;

  constructor(props) {
    this.props = props;
    this.addElements = this.addElements.bind(this);
    this.deleteElements = this.deleteElements.bind(this);
    if (Array.isArray(this.props.fieldDef.fields)) {
      this.elementChunkCount = this.props.fieldDef.fields.length;
    }
  }

  getJsx() {
    return (
      <ActionGroup
        fieldid={this.props.ids.fieldGroupId}
        key={this.props.ids.fieldGroupKey}
      >
        <Button
          variant="secondary"
          id={this.props.ids.fieldId}
          key={this.props.ids.fieldKey}
          fieldnumber={this.props.fieldNumber}
          onClick={this.addElements}
        >
          Add new {this.props.fieldDef.label}
        </Button>
        <Button
          variant="secondary"
          id={this.props.ids.fieldId + 1}
          key={this.props.ids.fieldKey + 1}
          fieldnumber={this.props.fieldNumber}
          onClick={this.deleteElements}
          disabled={this.elementAddCount == 0}
        >
          Delete last {this.props.fieldDef.label}
        </Button>
      </ActionGroup>
    );
  }

  addElements() {
    var childDef = this.props.fieldDef.fields;
    var children = [];
    if (Array.isArray(childDef)) {
      children.push(
        ...FieldFactory.newInstances(
          childDef,
          this.props.jsonSchema,
          this.props.pageNumber,
          this.props.page
        )
      );
    }
    this.props.page.addElements(
      this.props.fieldNumber +
        1 +
        this.elementAddCount * this.elementChunkCount,
      children
    );
    this.elementAddCount++;
  }

  deleteElements() {
    if (this.elementAddCount > 0) {
      this.props.page.deleteElements(
        this.props.fieldNumber +
          1 +
          this.elementChunkCount * (this.elementAddCount - 1),
        this.elementChunkCount
      );
      this.elementAddCount--;
    }
  }
}
