import React from 'react'
import {FormInput} from '../form-input/form-input.component'
import { DonationFormContainer } from './donation-form.styles'

const DonationForm = function({onChange,value}){
    
    return (
          <DonationFormContainer>
            <FormInput
                type='text'
                name='donationAmount'
                value={value}
                onChange={onChange}
                label='Please Enter the Donation Amount'
                required
              />
          </DonationFormContainer>
        
    )
}
export default DonationForm