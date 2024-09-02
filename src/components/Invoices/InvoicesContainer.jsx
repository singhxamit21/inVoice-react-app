import React from 'react'
import _ from 'lodash';
import List from './list/List';
import { INVOICE_LIST } from '../constants/constant';

const InvoicesContainer = () => {

  return (
    <>
    <List inVoiceList={INVOICE_LIST}/>
    </>
  )
}

export default InvoicesContainer