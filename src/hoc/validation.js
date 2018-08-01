import React from 'react';
import isEmpty from 'validator/lib/isEmpty';
import isURL from 'validator/lib/isURL';
import { defaultValidationMessages } from './../utils';

const validationHOC = (WrappedComponent) => (
  class extends React.Component {
     constructor(props) {
      super(props);
      this.validationErrors   = this.validationErrors.bind(this);
    }

    render() {
      return (
        <WrappedComponent {...this.props} validationErrors={this.validationErrors}/>
      )
    }

    componentDidUpdate(prevProps, prevState) {
      const { id, value } = this.props;
      if (this.reValidate(prevProps)) {
        this.props.updateField({
          id: id,
          value: value,
          errors: this.validationErrors(value)
        });
      }
    }

    reValidate(prevProps) {
      const { errors = [], showErrors } = this.props;
      return (
        (prevProps.showErrors != showErrors) && showErrors && errors.length == 0
      )
    }

    formattedValue(val) {
      if (Array.isArray(val)) {
        return val.map(o => o.value);
      } else {
        return String(val && val.hasOwnProperty('value') ? val.value : val);
      }
    }

    validationErrors(value) {
      const currentValue = this.formattedValue(value);
      let errors = [];
      if (this.props.customValidator) {
        errors = this.props.customValidator(this.props, currentValue);
      }

      const customErrorMessages = this.props.errorMessages || {};

      if (this.props.mandatory) {
        const mandatoryError = (customErrorMessages.mandatory)  || defaultValidationMessages.mandatory;
        if (Array.isArray(currentValue)) {
          if (currentValue.length < 1) { errors.push(mandatoryError); }
        } else {
          if (isEmpty(currentValue)) { errors.push(mandatoryError); }
        }
      }

      if (this.props.type == 'url') {
        if (!isEmpty(currentValue) && !isURL(currentValue)) {
          errors.push(customErrorMessages.invalidURL || defaultValidationMessages.invalidURL);
        }
      }

      return errors;
    }
  }
)

export default validationHOC;
