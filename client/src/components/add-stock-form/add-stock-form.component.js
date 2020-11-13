import React from 'react'
import {FormInput} from '../form-input/form-input.component'
import CustomButton from '../custom-button/custom-button.component';
import { AddStockFormContainer } from './add-stock-form.styles'

const AddStockForm = function({onChange,onSubmit,value}){
    
    return (
          <AddStockFormContainer onSubmit={onSubmit}>
            <FormInput
                type='text'
                name='stockName'
                value={value}
                onChange={onChange}
                label='Please Add the Stock'
                required
              />
            <CustomButton type='submit'>Add stock</CustomButton>
          </AddStockFormContainer>
        
    )
}
export default AddStockForm