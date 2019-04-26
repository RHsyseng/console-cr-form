import React, { Component } from "react";
import ElementFactory from "../element-component/ElementFactory";
import { Form } from "@patternfly/react-core";

/**
 * The Page component to handle each element individually.
 */
export default class Page extends Component {
  /**
   * Default constructor for the PageComponent.
   *
   * @param {*} props { pageDef, jsonSchema, pageNumber }
   */
  constructor(props) {
    super(props);
    this.state = {
      elements: []
    };
  }

  loadPageChildren() {
    var elements = ElementFactory.newInstances(
      this.props.pageDef.fields,
      this.props.pageDef.buttons,
      this.props.jsonSchema,
      this.props.pageNumber,
      this
    );

    this.setState({
      elements: elements
    });
  }

  /**
   * Adds a new element to the specific position at the Page and re-render the DOM.
   * @param {int} startIndex
   * @param {Element} element
   */
  addElements(startIndex, newElements, objectkey) {
    this.state.elements.forEach((element, i) => {
      // console.log(element.page.props.key);
      if (element.props != undefined && element.props.ids != undefined) {
        if (element.props.ids.fieldGroupId === objectkey) {
          startIndex = i;
        }
      }
    });
    if (Array.isArray(newElements)) {
      var elements = this.state.elements;
      newElements.forEach((element, count) => {
        elements.splice(startIndex + count + 1, 0, element);
      });

      this.setState({ elements: elements });
    } else {
      throw new Error(
        "When adding new elements to the page, please use an Array. Got: ",
        newElements
      );
    }
  }

  /**
   * Removes elements from the Page.
   *
   * @param {int} startIndex
   * @param {int} elementCount
   */
  deleteElements(startIndex, elementCount) {
    var elements = this.state.elements;
    elements.splice(startIndex, elementCount);
    this.setState({ elements: elements });
  }

  componentDidMount() {
    this.loadPageChildren();
  }

  getElements() {
    return this.state.elements;
  }

  render() {
    return (
      <Form id={"form-page-" + this.props.pageNumber}>
        <div key={"page" + this.props.pageNumber}>
          {this.state.elements.map(element => {
            return element.getJsx();
          })}
        </div>
      </Form>
    );
  }
}
