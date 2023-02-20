import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Row, Select} from "antd";
import {OrderTypeEnum} from "../utils/enums/OrderTypeEnum";
import {useLocation, useNavigate} from "react-router-dom";
import {useDeliveryChannels} from "../hooks/useDeliveryChannels";
import {useMarketplaces} from "../hooks/useMarketplaces";
import OrderTypeFrom from "../components/Order/OrderTypeFrom";
import OrderProductForm from "../components/Order/OrderProductForm";
import OrderCustomerForm from "../components/Order/OrderCustomerForm";


const OrderFormV2 = () => {
  const {state} = useLocation();
  const navigate = useNavigate()

  const [orderForm] = Form.useForm();

  useEffect(() => {
    console.log(state)
    if (!state) {
      navigate('/orders')
    }
  }, []);

  const {orderType} = state ? state : {};
  const {deliveryChannels} = useDeliveryChannels();



  const [loading, setLoading] = useState(false);


  const onFinish = (data) => {
    //setLoading(true);
    const images = data.images.map((file) => {
      return file.response;
    })
    const orderData = {
      ...data,
      images: images,
      orderType
    }
    console.log(orderData)

  }

  if (!state) {
    return;
  }

  return (
    <Card title="CREATE NEW ORDER" className="shadow" bodyStyle={{borderRadius: "10px", padding: "20px"}}>
      <Form
        name="order_form"
        form={orderForm}
        className="order-form"
        layout='vertical'
        initialValues={{
          isMerchant: false,
        }}
        onFinish={onFinish}
      >
        <OrderTypeFrom orderForm = {orderForm} orderType={state.orderType}/>
        <OrderProductForm orderForm={orderForm}/>
        {orderType === 1 ?<OrderCustomerForm orderForm={orderForm}/> : null}
        <Form.Item style={{float: 'right'}}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit Order
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default OrderFormV2;
