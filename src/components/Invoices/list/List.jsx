import React, { useState } from 'react'
import { dateToString, displayNumberInIndianFormat } from '../../utility/globalFunction';
import _ from 'lodash';
import {
  StyledList,
  Item,
  Uid,
  Hashtag,
  PaymentDue,
  ClientName,
  TotalPrice,
  LinkDiv,
} from './ListStyles';
import Status from '../status/Status';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { MenuItemWithKeyValueId, SelectField } from '../../common/common';
import { FILTER_STATUS } from '../../constants/constant';
import CreateInvoice from '../../common/modals/CreateInvoice';




const List = ({ ...props }) => {
  const { inVoiceList } = props;

  const [createInVoiceshow, setcreateInVoiceshow] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [list, setList] = useState(inVoiceList)


  const handleCreateInvoice = (ev) => {
    ev.preventDefault()
    setcreateInVoiceshow(true)
  }

  const handleEditInvoice = (ev, selectedData) => {
    ev.preventDefault()
    ev.stopPropagation();
    setEditFormData({ ...selectedData });
    setcreateInVoiceshow(true)
  }



  return (
    <Container>
      <Row>
        <Col md={12}>
          <div className='text-center mb-3'>
            <h1 className='text-success text-uppercase my-3'>Invoices</h1>
            <div className='card p-3 my-0'>
              <div className='d-flex justify-content-between align-items-center '>
            <span className='text-info'>{`There are ${list?.length || 0} total invoices`}</span>
     
            <Button variant="primary" onClick={handleCreateInvoice}>New Invoice</Button>
          </div></div></div>
        </Col>
        <Col md={9} className='mx-auto invoiceBox'>
          <StyledList className='list-unstyled overflow-auto h-50 p-3'>
            {list?.map(item => (
              <li key={item.id} onClick={(ev) => handleEditInvoice(ev, item)} style={{cursor:"pointer"}} className=''>
                <div className='p-3 shadow-sm itemsEffect'
                >
                  <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <Hashtag>#</Hashtag>
                        {item.id}
                      </div>
                      <div>
                        Due {dateToString(item.paymentDue)}
                      </div>
                      <div>{item.clientName}</div>
                      <div>
                        {displayNumberInIndianFormat(item.total, true)}
                      </div>
                      <Status currStatus={item.status} $grid />
                  </div>
                </div>
              </li>
            )
            )}
          </StyledList>
        </Col>
      </Row>
      <CreateInvoice createInVoiceshow={createInVoiceshow} handleClose={() => setcreateInVoiceshow(false)} editFormData={editFormData} setEditFormData={setEditFormData} inVoiceList={inVoiceList} list={list} setList={setList} />
    </Container>
  )
}

export default List