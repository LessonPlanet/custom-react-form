import React, { Component } from 'react';
import Input from './input';

class Checkbox extends Component {
  render() {
    let valueNodes = [];
    let value = this.props.value;

    for (let i = 0; i < value.length; i++) {

      let el = value[i];

      let obj = {
        ...el, key: i, checked: el.selected,
        type: this.props.type,
        name: this.props.name,
        value: this.props.value,
      };

      let node = <Input {...obj} />
      valueNodes.push(node);
    }

    return (
      <div className={`form-group ${this.props.formGroupClassName}`}>
        <div><h4>{this.props.label}</h4></div>
        {valueNodes}
      </div>
    );
  }
}

Checkbox.defaultProps = {
  formGroupClassName: ''
};

export default Checkbox;
