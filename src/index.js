import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from './components/input';
import File from './components/file';
import Textarea from './components/textarea';
import Richtext from './components/richtext';
import Radio from './components/radio';
import Checkbox from './components/checkbox';
import Select from './components/select';
import SelectTab from './components/select-tab';
import Password from './components/password';
import Url from './components/url';
import Container from "./components/container";
import ExternalComponentContainer from "./components/external-component-container";
import { randomInt } from './utils';

const FIELD_CLASS = {
  'checkbox': Checkbox,
  'radio': Radio,
  'selectTab': SelectTab,
  'select': Select,
  'text': Input,
  'file': File,
  'url': Url,
  'password': Password,
  'textarea': Textarea,
  'richtext': Richtext,
  'container': Container,
  'external-component': ExternalComponentContainer
}

class CustomReactForm extends Component {
  constructor(props) {
    super(props);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.state = {
      fields: this.updatedFields(this.props.fields)
    };
  }

  updatedFields(fields) {
    let childrenObj = {};
    fields.forEach(function (el, i) {
      const fieldId = el.id || randomInt();
      childrenObj[fieldId] = { ...el, key: fieldId };
    });

    return childrenObj;
  }

  classForType(type) {
    return FIELD_CLASS[type] || Input;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ fields: this.updatedFields(nextProps.fields) });
  }

  get isValid() {
    return !(Object.values(this.state.fields).find(el => {
      return el.errors && el.errors.length > 0
    }));
  }

  handleFieldChange(field) {
    const { updateField, ...updatedField } = field;
    this.props.updateParentCallback(updatedField);
  }

  render() {
    const { title, subTitle } = this.props.settings;
    let childNodes = [];
    let fields = this.state.fields;
    for (var key in fields) {
      if (fields.hasOwnProperty(key)) {
        let el = fields[key];
        el.id = key;
        el.showErrors = this.props.showAllErrors || el.showErrors;
        const CustomComponent = this.classForType(el.type);
        if (el.type == 'external-component') {
          const { component, type, ...wrapperProps } = el;
          const ExternalComponent = component;
          childNodes.push(
            <CustomComponent {...wrapperProps}>
              <ExternalComponent
                {...wrapperProps}
                updateField={this.handleFieldChange}
              />
            </CustomComponent>
          );
        } else {
          childNodes.push(
            <CustomComponent
              {...el}
              updateField={this.handleFieldChange}
            />
          );
        }
      }
    }

    return (
      <div className="form-container">
        <form onSubmit={this.onSubmit}>
          <h2 className="form-title"><b>{title}</b> {subTitle}</h2>
          {childNodes}
        </form>
      </div>
    );
  }

  onSubmit(e) {
    e.preventDefault();
    return false;
  }
}

CustomReactForm.propTypes = {
  updateParentCallback: PropTypes.func.isRequired
};

export default CustomReactForm;
export { File }
export { Richtext }
export { Input }
export { SelectTab }
export { Url }
