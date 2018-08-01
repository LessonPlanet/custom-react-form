import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TooltipLink from './tooltip-link';
import ReactQuill from 'react-quill';
import validationHOC from '../hoc/validation.js';

import 'react-quill/dist/quill.snow.css';

class Richtext extends PureComponent {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.formats = ['bold', 'italic', 'underline', 'list', 'bullet', 'indent']
    this.modules = {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }]
      ],
    }
  }

  handleChange(content, delta, source, editor) {
    this.props.updateField({
      id: this.props.id,
      value: (content == '<p><br></p>' ? '' : content).trim(),
      errors: this.props.validationErrors(editor.getText().trim()),
      showErrors: true
    });
  }

  componentDidMount() {
    if (this.props.updateOnMount) {
      this.props.updateField({
        ...this.props,
        errors: this.props.validationErrors(this.props.value),
        showErrors: false,
        fromInit: true
      });
    }
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
        <div className="richtext">
          <ReactQuill
            value={this.props.value}
            onChange={this.handleChange}
            modules={this.modules}
            formats={this.formats}
            placeholder={this.props.placeholder}
            className="editor"
          />
        </div>
        {showErrors && errors.length > 0 && <div className='error'>{errors}</div>}
      </div>
    );
  }
}

Richtext.defaultProps = {
  formGroupClassName: '',
  errors: [],
  errorMessages: {},
  updateOnMount: true
};

Richtext.propTypes = {
  updateField: PropTypes.func.isRequired
};

export default validationHOC(Richtext);
