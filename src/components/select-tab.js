import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select, { Creatable, Async, AsyncCreatable } from 'react-select-plus';
import TooltipLink from './tooltip-link';
import validationHOC from '../hoc/validation.js';

import 'react-select-plus/dist/react-select-plus.css';

class SelectTab extends PureComponent {
  constructor(props) {
    super(props);
    this.onChange   = this.onChange.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  componentDidMount() {
    if (this.props.updateOnMount) {
      const { validationErrors, updateField, ...props } = this.props;
      updateField({
        ...props,
        errors: validationErrors(props.value),
        showErrors: props.showErrors,
        fromInit: true
      });
    }
  }

  keyValueObject(object) {
    return (({ label, value }) => ({ label, value }))(object);
  }

  onChange(selectedOption) {
    let selectedValue = null;
    let selectedObj   = null;
    if (Array.isArray(selectedOption)) {
      selectedValue = selectedOption.map(o => o.value);
      selectedObj = selectedOption.map(o => this.keyValueObject(o));
    } else {
      selectedValue = selectedOption ? selectedOption.value : '';
      selectedObj = selectedOption ? this.keyValueObject(selectedOption) : '';
    }

    this.props.updateField({
      id: this.props.id,
      value: selectedObj,
      errors: this.props.validationErrors(selectedValue),
      showErrors: true
    });
  }

  get customSelectClass() {
    const { allowNew, async } = this.props;
    if (allowNew && async) return AsyncCreatable;
    if (async) return Async;
    if (allowNew) return Creatable;
    return Select;
  }

  getOptions(input) {
    if (this.props.loadOptions) return this.props.loadOptions(input);
    if (!this.props.url) return { options: [] };
    const optionKey = this.props.urlParam || 'key';
    return fetch(`${this.props.url}?${optionKey}=${input}`)
      .then((response) => {
        return response.json();
      }).then((json) => {
        return { options: json };
      });
  }

  render() {
    const { label, id, mandatory, options, multi, value, errors, showErrors, tooltip, formGroupClassName, autoload } = this.props;
    const mandatoryMark = mandatory ? (<span>*</span>): '';
    let formGroupClasses = ['form-group', formGroupClassName];
    formGroupClasses.push(showErrors && errors.length > 0 ? 'has-error' : '');
    let SelectPlusComponent = this.customSelectClass;
    let customProps = {};
    if (this.props.async) customProps.loadOptions = this.getOptions;

    return (
      <div className={formGroupClasses.join(' ')} ref={input => {
            this.selectInput = input;
          }}>
        <label htmlFor={id}>
          {label}
          {mandatoryMark}
          {tooltip && <TooltipLink tooltip={tooltip} />}
        </label>
        <SelectPlusComponent
          name={this.props.name}
          className="select-tab"
          value={value}
          options={options}
          multi={multi}
          placeholder={this.props.placeholder}
          onChange={this.onChange}
          autoload={autoload}
          {...customProps}
        />

        {showErrors && errors.length > 0 && <div className='error'>{errors}</div>}
      </div>
    );
  }
}

SelectTab.defaultProps = {
  formGroupClassName: '',
  errors: [],
  autoload: false,
  errorMessages: {},
  updateOnMount: true
};

SelectTab.propTypes = {
  updateField: PropTypes.func.isRequired
};

export default validationHOC(SelectTab);
