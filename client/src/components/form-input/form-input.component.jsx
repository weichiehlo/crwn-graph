import React from 'react';

import {
  GroupContainer,
  FormInputContainer,
  FormInputLabel,
  FormSelectContainer,
  FormSelectLabel
} from './form-input.styles';

export const FormInput = ({ handleChange, label, ...props }) => (
  <GroupContainer>
    <FormInputContainer onChange={handleChange} {...props} />
    {label ? (
      <FormInputLabel className={props.value.length ? 'shrink' : ''}>
        {label}
      </FormInputLabel>
    ) : null}
  </GroupContainer>
);

export const FormSelect = ({ handleChange, label, ...props }) => (
  <GroupContainer>
    {label ? (
      <FormSelectLabel>
        {label}
      </FormSelectLabel>
    ) : null}
    <FormSelectContainer onChange={handleChange} {...props} />
  </GroupContainer>
);



