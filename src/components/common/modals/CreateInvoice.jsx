import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { TextField } from '../common';
import _, { omit } from 'lodash';
import { generateRandomCode, getCurrentDate } from '../../utility/globalFunction';
import SelectPayments from '../../payments/SelectPayments';

const CreateInvoice = ({ ...props }) => {
    const { createInVoiceshow, handleClose, editFormData, list, setList, inVoiceList } = props;
    const [formData, setFormData] = useState({
        senderAddress: {
            street: "",
            city: "",
            postCode: "",
            country: ""
        },
        clientName: "",
        clientEmail: "",
        clientAddress: {
            street: "",
            city: "",
            postCode: "",
            country: ""
        },
        description: "",
        items: [{ name: "", quantity: "", price: "", total: "" }],
    });

    const [errors, setErrors] = useState({});
    const [statusBtn, setStatusBtn] = useState("")

    useEffect(() => {
        const editResp = _.cloneDeep(editFormData)
        if (!_.isEmpty(editResp)) {
            setFormData(editResp)
        }
    }, [editFormData])

    const handleChange = (event, key, subKey) => {
        const { name, value } = event.target
        if ((name === "senderPostCode" || name === "clientPostCode") && !/^\d*$/.test(event.target.value)) {
            return;
        }
        if (subKey) {
            setFormData({
                ...formData,
                [key]: {
                    ...formData[key],
                    [subKey]: value
                }
            });
            const newObj = omit(errors, name);
            setErrors(newObj);

        } else {
            setFormData({
                ...formData,
                [key]: event.target.value
            });
            const newObj = omit(errors, name);
            setErrors(newObj);
        }

    };

    const handleItemChange = (index, event, key) => {
        if ((key === "quantity" || key === "price") && !/^\d*$/.test(event.target.value)) {
            return;
        }
        const updatedItems = formData?.items?.map((item, i) =>
            i === index ? { ...item, [key]: event.target.value } : item
        );

        setFormData({
            ...formData,
            items: updatedItems
        });

        const newObj = omit(errors, event.target.name);
        setErrors(newObj);


    };

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { name: "", quantity: "", price: "", total: "" }]
        });

    };

    const handleRemoveItem = (index) => {
        if (formData?.items?.length > 1) {
            const updatedItems = formData?.items?.filter((_, i) => i !== index);
            setFormData({
                ...formData,
                items: updatedItems
            });
        }

    };



    const validate = () => {
        let formErrors = {};
        if (!formData?.senderAddress?.street) formErrors.senderStreet = "Street address is required";
        if (!formData?.senderAddress?.city) formErrors.senderCity = "City is required";
        if (!formData?.senderAddress?.postCode) formErrors.senderPostCode = "Post Code is required";
        if (!formData?.senderAddress?.country) formErrors.senderCountry = "Country is required";
        if (!formData?.clientName) formErrors.clientName = "Client's name is required";
        if (!formData?.clientEmail) formErrors.clientEmail = "Client's email is required";
        if (!formData?.clientAddress?.street) formErrors.clientStreet = "Street address is required";
        if (!formData?.clientAddress?.city) formErrors.clientCity = "City is required";
        if (!formData?.clientAddress?.postCode) formErrors.clientPostCode = "Post Code is required";
        if (!formData?.clientAddress?.country) formErrors.clientCountry = "Country is required";
        if (!formData?.description) formErrors.description = "Project description is required";

        formData?.items?.map((item, index) => {
            if (!item.name) formErrors[`itemName${index}`] = "Item name is required";
            if (!item.quantity) formErrors[`itemQty${index}`] = "Quantity is required";
            if (!item.price) formErrors[`itemPrice${index}`] = "Price is required";
        });
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleClick = (clickType) => {
        if (validate()) {
            setStatusBtn(clickType)
            const formDataResp = _.cloneDeep(formData)
            if (clickType == "saveClick") {
                formDataResp["status"] = "pending"
            }
            

            if (formDataResp?.id) {
                const index = list.findIndex(invoice => invoice.id === formDataResp.id);
                if (index !== -1) {
                    const updatedList = [...list];
                    updatedList[index] = formDataResp;
                    setList(updatedList);
                }
            } else {
                
                let {items} = formDataResp
                
                let overallTotal = 0; 
                let updatedItem = items.map(item => {
                  const quantity = parseFloat(item.quantity);
                  const price = parseFloat(item.price);
                  const total = quantity * price;
                  item.total = total.toFixed(2); 
                  overallTotal += total;
                });
                
                formDataResp["total"]  = overallTotal.toFixed(2);
                formDataResp["items"] = updatedItem
                formDataResp["id"] = generateRandomCode()
                formDataResp["paymentDue"] = getCurrentDate();
                setList([formDataResp, ...list])
            }

            if (clickType == "saveClick") {
                reset()
                handleClose();
            }


        }


    };
    const handleHide = () => {
        reset()
        handleClose()
    }
    const reset = () => {
        setFormData({
            senderAddress: {
                street: "",
                city: "",
                postCode: "",
                country: ""
            },
            clientName: "",
            clientEmail: "",
            clientAddress: {
                street: "",
                city: "",
                postCode: "",
                country: ""
            },
            description: "",
            items: [{ name: "", quantity: "", price: "", total: "" }]
        })
        setErrors({})
        setStatusBtn("")
    }

    return (
        <Modal size={statusBtn == "paidClick" ? "md" :"lg"} show={createInVoiceshow} onHide={handleHide}>
            <Modal.Header closeButton>
                <Modal.Title className='text-uppercase'>{statusBtn == "paidClick" ? "Payment" : formData?.id ? "Update Invoice" : "New Invoice"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {statusBtn == "paidClick" ? <SelectPayments statusBtn={statusBtn} setStatusBtn={setStatusBtn} formData={formData} list={list} setList={setList} inVoiceList={inVoiceList} handleClose={handleClose} /> :
                    <>
                        <Row>
                            <Col md={12}>
                                <div className='text-dark fw-bold text-uppercase text-decoration-underline mb-3'>Bill From</div>
                            </Col>
                            <Col md={12}>
                                <TextField
                                    name="senderStreet"
                                    label="Street Address"
                                    onChange={(e) => handleChange(e, 'senderAddress', 'street')}
                                    error={errors}
                                    value={formData?.senderAddress?.street}
                                    disabled={formData?.status == "paid" ? true : false}
                                    maxLength={50}
                                />
                            </Col>
                            <Col md={4}>
                                <TextField
                                    name="senderCity"
                                    label="City"
                                    onChange={(e) => handleChange(e, 'senderAddress', 'city')}
                                    error={errors}
                                    value={formData?.senderAddress?.city}
                                    disabled={formData?.status == "paid" ? true : false}
                                    maxLength={20}
                                />
                            </Col>
                            <Col md={4}>
                                <TextField
                                    name="senderPostCode"
                                    label="Post Code"
                                    onChange={(e) => handleChange(e, 'senderAddress', 'postCode')}
                                    error={errors}
                                    value={formData?.senderAddress?.postCode}
                                    disabled={formData?.status == "paid" ? true : false}
                                    maxLength={6}
                                />
                            </Col>
                            <Col md={4}>
                                <TextField
                                    name="senderCountry"
                                    label="Country"
                                    onChange={(e) => handleChange(e, 'senderAddress', 'country')}
                                    error={errors}
                                    value={formData?.senderAddress?.country}
                                    disabled={formData?.status == "paid" ? true : false}
                                    maxLength={20}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <div className='text-dark fw-bold text-uppercase text-decoration-underline mb-3'>Bill to</div>
                            </Col>
                            <Col md={6}>
                                <TextField
                                    name="clientName"
                                    label="Client's Name"
                                    onChange={(e) => handleChange(e, 'clientName')}
                                    error={errors}
                                    value={formData?.clientName}
                                    disabled={formData?.status == "paid" ? true : false}
                                    maxLength={20}
                                />
                            </Col>
                            <Col md={6}>
                                <TextField
                                    name="clientEmail"
                                    label="Client's Email"
                                    onChange={(e) => handleChange(e, 'clientEmail')}
                                    error={errors}
                                    value={formData?.clientEmail}
                                    disabled={formData?.status == "paid" ? true : false}
                                    maxLength={20}
                                />
                            </Col>
                            <Col md={12}>
                                <TextField
                                    name="clientStreet"
                                    label="Street Address"
                                    onChange={(e) => handleChange(e, 'clientAddress', 'street')}
                                    error={errors}
                                    value={formData?.clientAddress?.street}
                                    disabled={formData?.status == "paid" ? true : false}
                                    maxLength={50}
                                />
                            </Col>
                            <Col md={4}>
                                <TextField
                                    name="clientCity"
                                    label="City"
                                    onChange={(e) => handleChange(e, 'clientAddress', 'city')}
                                    error={errors}
                                    value={formData?.clientAddress?.city}
                                    disabled={formData?.status == "paid" ? true : false}
                                    maxLength={20}
                                />
                            </Col>
                            <Col md={4}>
                                <TextField
                                    name="clientPostCode"
                                    label="Post Code"
                                    onChange={(e) => handleChange(e, 'clientAddress', 'postCode')}
                                    error={errors}
                                    value={formData?.clientAddress?.postCode}
                                    disabled={formData?.status == "paid" ? true : false}
                                    maxLength={6}
                                />
                            </Col>
                            <Col md={4}>
                                <TextField
                                    name="clientCountry"
                                    label="Country"
                                    onChange={(e) => handleChange(e, 'clientAddress', 'country')}
                                    error={errors}
                                    value={formData?.clientAddress?.country}
                                    disabled={formData?.status == "paid" ? true : false}
                                    maxLength={20}
                                />
                            </Col>
                            <Col md={12}>
                                <TextField
                                    name="description"
                                    label="Project Description"
                                    onChange={(e) => handleChange(e, 'description')}
                                    error={errors}
                                    value={formData?.description}
                                    disabled={formData?.status == "paid" ? true : false}
                                    maxLength={50}
                                />
                            </Col>
                            <Col md={12}>
                                <div className='card p-3 my-0'>
                                    <div className='itemBox'>
                                        {formData?.items?.map((item, index) => (
                                            <Row key={index}>
                                                <Col md={3}>
                                                    <TextField
                                                        type="text"
                                                        name={`itemName${index}`}
                                                        placeholder="Item Name"
                                                        value={item["name"]}
                                                        onChange={(event) => handleItemChange(index, event, "name")}
                                                        error={errors}
                                                        disabled={formData?.status == "paid" ? true : false}
                                                        maxLength={20}
                                                    />
                                                </Col>
                                                <Col md={2}>
                                                    <TextField
                                                        type="text"
                                                        name={`itemQty${index}`}
                                                        placeholder="Qty"
                                                        value={item["quantity"]}
                                                        onChange={(event) => handleItemChange(index, event, "quantity")}
                                                        error={errors}
                                                        disabled={formData?.status == "paid" ? true : false}
                                                        maxLength={3}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <TextField
                                                        type="text"
                                                        name={`itemPrice${index}`}
                                                        placeholder="Price"
                                                        value={item["price"]}
                                                        onChange={(event) => handleItemChange(index, event, "price")}
                                                        error={errors}
                                                        disabled={formData?.status == "paid" ? true : false}
                                                        maxLength={10}
                                                    />
                                                </Col>
                                                <Col md={2}>
                                                    <TextField
                                                        type="text"
                                                        name={`itemTotal${index}`}
                                                        placeholder="Total"
                                                        value={(item["price"] * item["quantity"]) || 0}
                                                        disabled={true}
                                                    />
                                                </Col>
                                                <Col md={2}>
                                                    {formData?.status == "paid" ? null :
                                                        <Button variant="danger" className="w-100" onClick={() => handleRemoveItem(index)}>Delete</Button>}
                                                </Col>
                                            </Row>
                                        ))}</div>
                                    {formData?.status == "paid" ? null : <div className='ms-auto'>
                                        <Button variant="success" onClick={handleAddItem}>+ Add New</Button></div>}
                                </div>
                            </Col>
                        </Row></>}


            </Modal.Body>
            {statusBtn == "paidClick" ? null : 
            <Modal.Footer>
                {formData?.status == "paid" || statusBtn == "paidClick" ? null :
                    <>
                        <Button variant="warning" onClick={() => handleClick("paidClick")}>
                            Mark as Paid
                        </Button>
                        <Button variant="dark" onClick={() => handleClick("saveClick")}>
                            Save & Send
                        </Button>
                    </>
                }

            </Modal.Footer>}
        </Modal>
    );
};

export default CreateInvoice;
