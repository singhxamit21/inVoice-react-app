import React, { useEffect, useState } from 'react';
import "./selectPayments.css";
import { capitalizeFirstLetter } from '../utility/globalFunction';
import { TextField } from '../common/common';
import _, { omit } from 'lodash';

const SelectPayments = ({ ...props }) => {
    const { statusBtn, setStatusBtn,list,setList,inVoiceList,formData,handleClose } = props;
    const [paymentType, setPaymentType] = useState("creditCard");
    const [info, setInfo] = useState({});
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (paymentType === "creditCard") {
            setInfo({
                cardholderName: "",
                cardNumber: "",
                expMonth: "",
                expYear: "",
                cvcNumber: ""
            })
        } else {
            setInfo({
                fullName: "",
                billingAddress: "",
                state: "",
                city: "",
                zip: ""
            })
        }
    }, [paymentType])

    const handlePaymentTypeClick = (ev, type) => {
        ev.preventDefault();
        setPaymentType(type);
        setErrors({});
    };

    const handleChange = (ev) => {
        const { name, value } = ev.target;
        setInfo({ ...info, [name]: value });
        const newObj = omit(errors, name);
        setErrors(newObj);
       
    };

 

    const handleBack = () => {
        setStatusBtn("saveClick");
    };

    const validateFields = () => {
        const newErrors = {};
        if (paymentType === "creditCard") {
            if (!info.cardholderName) newErrors.cardholderName = "Cardholder Name is required";
            if (!info.cardNumber || !/^\d{16}$/.test(info.cardNumber.replace(/-/g, ''))) newErrors.cardNumber = "Invalid Card Number";
            if (!info.expMonth || !/^(0[1-9]|1[0-2])$/.test(info.expMonth)) newErrors.expMonth = "Invalid Exp. Month";
            if (!info.expYear || !/^\d{2}$/.test(info.expYear)) newErrors.expYear = "Invalid Exp. Year";
            if (!info.cvcNumber || !/^\d{3}$/.test(info.cvcNumber)) newErrors.cvcNumber = "Invalid CVC Number";
        } else {
            if (!info.fullName) newErrors.fullName = "Full Name is required";
            if (!info.billingAddress) newErrors.billingAddress = "Billing Address is required";
            if (!info.city) newErrors.city = "City is required";
            if (!info.state) newErrors.state = "State is required";
            if (!info.zip || !/^\d{5}$/.test(info.zip)) newErrors.zip = "Invalid Zip Code";
        }
        return newErrors;
    };

    const handleProceed = () => {
        const validationErrors = validateFields();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            const formDataResp = _.cloneDeep(formData)
            formDataResp["status"] = "paid"
            const index = list.findIndex(invoice => invoice.id === formDataResp.id);
            if (index !== -1) {
                const updatedList = [...list];
                updatedList[index] = formDataResp;  
                setList(updatedList);  
            }
            handleClose()
            reset()
        }
    };
    
    const reset = () => {
        setErrors({});
        setPaymentType("creditCard");
        setStatusBtn("saveClick");
    }
    return (
            <article className="">
                <div className="card m-0 p-3">               
                    <div className="card-body p-0">
                        <div className="payment-type">
                            <h4>Choose payment method below</h4>
                            <div className="types flex justify-space-between">
                                <div className={`type ${paymentType === "creditCard" ? "selected" : ""}`} onClick={(ev) => handlePaymentTypeClick(ev, "creditCard")}>
                                    <div className="text">
                                        <p>Pay with Credit Card</p>
                                    </div>
                                </div>
                                <div className={`type ${paymentType === "payPal" ? "selected" : ""}`} onClick={(ev) => handlePaymentTypeClick(ev, "payPal")}>
                                    <div className="text">
                                        <p>Pay with PayPal</p>
                                    </div>
                                </div>
                                <div className={`type ${paymentType === "amazon" ? "selected" : ""}`} onClick={(ev) => handlePaymentTypeClick(ev, "amazon")}>
                                    <div className="text">
                                        <p>Pay with Amazon</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="payment-info flex justify-space-between">
                            {paymentType === "payPal" || paymentType === "amazon" ? (
                                <div className=" billing">
                                    <div className="title">
                                        <h4>{capitalizeFirstLetter(paymentType)} Billing Info</h4>
                                    </div>
                                    <div className="field full">
                                        <TextField
                                            name="fullName"
                                            label="Full Name"
                                            placeholder="Full Name"
                                            onChange={handleChange}
                                            error={errors}
                                            value={info?.fullName}
                                            maxLength={20}
                                        />
                                    </div>
                                    <div className="field full">
                                        <TextField
                                            name="billingAddress"
                                            label="Billing Address"
                                            placeholder="Billing Address"
                                            onChange={handleChange}
                                            error={errors}
                                            value={info?.billingAddress}
                                            maxLength={50}
                                        />
                                    </div>
                                    <div className="flex justify-space-between">
                                        <div className="field half">
                                            <TextField
                                                name="city"
                                                label="City"
                                                placeholder="City"
                                                onChange={handleChange}
                                                error={errors}
                                                value={info?.city}
                                                maxLength={20}
                                            />
                                        </div>
                                        <div className="field half">
                                            <TextField
                                                name="state"
                                                label="State"
                                                placeholder="State"
                                                onChange={handleChange}
                                                error={errors}
                                                value={info?.state}
                                                maxLength={20}
                                            />
                                        </div>
                                    </div>
                                    <div className="field full">
                                        <TextField
                                            name="zip"
                                            label="Zip"
                                            placeholder="Zip"
                                            onChange={handleChange}
                                            error={errors}
                                            value={info?.zip}
                                            maxLength={5}
                                        />
                                    </div>
                                </div>
                            ) : null}
                            {paymentType === "creditCard" ? (
                                <div className="column1 shipping">
                                    <div className="title">
                                        <h4>Credit Card Info</h4>
                                    </div>
                                    <div className="field full">
                                        <TextField
                                            name="cardholderName"
                                            label="Cardholder Name"
                                            placeholder="Full Name"
                                            onChange={handleChange}
                                            error={errors}
                                            value={info?.cardholderName}
                                            maxLength={20}
                                        />
                                    </div>
                                    <div className="field full">
                                        <TextField
                                            name="cardNumber"
                                            label="Card Number"
                                            placeholder="1234-5678-9012-3456"
                                            onChange={handleChange}
                                            error={errors}
                                            maxLength={19}
                                            value={info?.cardNumber}
                                        />
                                    </div>
                                    <div className="flex justify-space-between">
                                        <div className="field half">
                                            <TextField
                                                name="expMonth"
                                                label="Exp. Month"
                                                placeholder="12"
                                                onChange={handleChange}
                                                error={errors}
                                                maxLength={2}
                                                value={info?.expMonth}
                                            />
                                        </div>
                                        <div className="field half">
                                            <TextField
                                                name="expYear"
                                                label="Exp. Year"
                                                placeholder="19"
                                                onChange={handleChange}
                                                error={errors}
                                                maxLength={2}
                                                value={info?.expYear}
                                            />
                                        </div>
                                    </div>
                                    <div className="field full">
                                        <TextField
                                            name="cvcNumber"
                                            label="CVC Number"
                                            placeholder="468"
                                            onChange={handleChange}
                                            error={errors}
                                            maxLength={3}
                                            value={info?.cvcNumber}
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="card-actions flex justify-space-between">
                        <div className="flex-start">
                            <button className="button button-secondary" onClick={handleBack}>Back</button>
                        </div>
                        <div className="flex-end">
                            <button className="button button-primary" onClick={handleProceed}>Proceed</button>
                        </div>
                    </div>
                </div>
            </article>
    );
};

export default SelectPayments;
