import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TooltipLink from './tooltip-link';
import validationHOC from '../hoc/validation.js';

class Url extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onChange   = this.onChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidMount() {
    if (this.props.updateOnMount) {
      this.props.updateField({
        ...this.props,
        errors: this.props.validationErrors(this.props.value),
        showErrors: this.props.showErrors,
        fromInit: true
      });
    }
  }

  onChange(event) {
    const value = event.currentTarget.value;
    this.props.updateField({
      id: this.props.id,
      value: value,
      errors: this.props.validationErrors(value),
      showErrors: true
    });
  }

  onKeyPress(e) {
    if (this.props.allowOnlyPaste) {
      e.preventDefault();
    }
  }

  render() {
    const { label, mandatory, errors, showErrors, tooltip, formGroupClassName } = this.props;
    const mandatoryMark = mandatory ? (<span>*</span>): '';
    let formGroupClasses = ['form-group', formGroupClassName];
    formGroupClasses.push(showErrors && errors.length > 0 ? 'has-error' : '');

    return (
      <div className={formGroupClasses.join(' ')}>
        <label htmlFor={this.props.id}>
          {label}
          {mandatoryMark}
          {tooltip && <TooltipLink tooltip={tooltip} />}
        </label>
        <input
          id={this.props.id}
          value={this.props.value}
          type='url'
          disabled={this.props.disabled}
          placeholder={this.props.placeholder}
          className={this.props.className}
          onChange={this.onChange}
          onKeyPress={this.onKeyPress}
        />
        {showErrors && errors.length > 0 && <div className='error'>{errors}</div>}
      </div>
    );
  }
}

Url.defaultProps = {
  formGroupClassName: '',
  errors: [],
  errorMessages: {},
  allowOnlyPaste: false,
  updateOnMount: true
};

Url.propTypes = {
  updateField: PropTypes.func.isRequired
};

export default validationHOC(Url);
