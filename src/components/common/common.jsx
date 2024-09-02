
import { Form } from 'react-bootstrap'
import React, { useEffect, useRef, useState } from 'react';
import { checkInappropriateStr } from '../utility/globalFunction';
import _ from 'lodash';


export const MenuItemWithKeyValueId = (options = [], keyProp, labelProp) => (
  _.isArray(options) && options.map(option =>
    <option key={option[keyProp]} value={option[keyProp]}>
      {option[labelProp]}
    </option>
  ));


export const SelectField = ({ label, ...props }) => {
  const { className } = props;
  let labelClass = 'label-name block';
  let mandatoryClass = (props.mandatory === "no") ? '' : ' mandatory-after';
  labelClass += mandatoryClass;
  let ddDisabled = props.dddisabled || props.ddDisabled;
  const element = useRef()
  const handleOnChange = (e) => {
    if (!props.disabled) {
      props.onChange(e);
    } else {
      e.preventDefault()
    }
  }
  return (
    <Form className={className}>
      <label className={labelClass}>{label}</label>
      <Form.Group>
        <Form.Control as="select"
          {...props} className="form-select"
          ref={element}
          onChange={(e) => handleOnChange(e)}
        >
          <option value="" disabled={(ddDisabled === "no") ? false : true}>Select</option>
          {props.dataarray || props.dataArray}
        </Form.Control>
        {(props.error && props.error[props.name]) ? <span className="error">{props.error[props.name]}</span> : null}
      </Form.Group>
    </Form>
  );
};


export const TextField = ({ ...props }) => {
  const { name, label, error } = props
  const handleOnChange = (e) => {
    let { value } = e.target;
    if (!props.disabled) {
      if (!checkInappropriateStr(value)) {
        props.onChange(e);
      }
    } else {
      e.preventDefault()
    }
  }
  return (
    <>
      <Form.Group className='mb-3'>
        {label ? 
        <Form.Label htmlFor={name}>{label}</Form.Label>:null}
        <Form.Control {...props}
          onChange={(e) => handleOnChange(e)}
        />
        {(error && error[name]) ? <span style={{
          position: "relative!important",
          color: "red",
          textTransform: "none",
          fontSize: "0.85rem",
          letterSpacing: "-0.1px"
        }}>{error[name]}</span > : null
        }
      </Form.Group>
    </>
  )

}