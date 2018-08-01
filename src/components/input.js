import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TooltipLink from './tooltip-link';
import validationHOC from '../hoc/validation.js';

class Input extends PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    if (this.props.updateOnMount) {
      this.props.updateField({
        ...this.props,
        showErrors: false,
        errors: this.props.validationErrors(this.props.value),
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

  render() {
    const { label, id, mandatory, errors, showErrors, tooltip, formGroupClassName } = this.props;
    const mandatoryMark = mandatory ? (<span>*</span>): '';
    let formGroupClasses = ['form-group', formGroupClassName];
    formGroupClasses.push(showErrors && errors.length > 0 ? 'has-error' : '');

    return (
      <div className={formGroupClasses.join(' ')}>
        <label htmlFor={id}>
          {label}
          {mandatoryMark}
          {tooltip && <TooltipLink tooltip={tooltip} />}
        </label>
        <input
          id={id}
          type={this.props.type}
          value={this.props.value}
          placeholder={this.props.placeholder}
          className={this.props.className}
          disabled={this.props.disabled}
          onChange={this.onChange}
        />
        {showErrors && errors.length > 0 && <div className='error'>{errors}</div>}
      </div>
    );
  }
}

Input.defaultProps = {
  formGroupClassName: '',
  errors: [],
  errorMessages: {},
  updateOnMount: true
};

Input.propTypes = {
  updateField: PropTypes.func.isRequired
};

export default validationHOC(Input);
