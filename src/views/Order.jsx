import React, {useEffect, useState} from 'react';

import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import {Card, Descriptions, Skeleton, Image, Space, Col, Row, Empty, Tag, Table} from 'antd';
import axiosClient from "../axios-client.js";
import {colors} from "../utils/Colors.js";
import moment from "moment";
import {CalendarOutlined} from "@ant-design/icons";
import PaymentSummary from "../components/Order/PaymentSummary";
import CustomerInfo from "../components/Order/CustomerInfo";
import OrderHeader from "../components/Order/OrderHeader";


const Order = () => {

  const [Loading, setLoading] = useState(false);
  const [order, setOrder] = useState({});


  const {id} = useParams()


  useEffect(() => {
    fetchOrders();
  }, [])

  const fetchOrders = async () => {

    setLoading(true);
    try {
      const order = await axiosClient.get(`/orders/getOrder/${id}`);
      setOrder({...order.data.data})
      setLoading(false)
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      toast.error(message);
      setLoading(false);
    }

  }

  const products = [
    {
      title: 'Product',
      dataIndex: 'productType',
      key: 'id',
      render: (_, record) => (
        <div className='flex flex-col'>
          <h2 className='text-zinc-600'>{record.productType}</h2>
          <div>Color: <span className='text-zinc-600 font-bold'>{record.productColor}</span></div>
          <div>Fabric: <span className='text-zinc-600 font-bold'>{record.productFabric}</span></div>
        </div>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'id',
    },
    {
      title: 'Unit Count',
      dataIndex: 'unit',
      key: 'id',
    }
  ];

  return (
    <>
      {order.id ? <OrderHeader orderId={order.id} status={order.status} createdAt={order.createdAt}/> : <Skeleton paragraph={{rows: 2}}/>}
      <Row gutter={[12, 0]}>
        <Col xs={24} md={16}>
          <Row gutter={[12, 12]}>
            <Col xs={24} md={24}>
              {order.products ?<Table columns={products} rowKey="id" dataSource={order.products} pagination={false}/> : <Skeleton paragraph={{rows: 3}}/>}
            </Col>
            <Col xs={24} md={24}>
              <Card  title="Payment Summary">
                {order.payment ?
                  <PaymentSummary payment={order.payment}/> : <Skeleton paragraph={{rows: 3}}/>}
              </Card>
            </Col>
          </Row>

        </Col>

        <Col xs={24} md={8}>
          <Row gutter={[12, 12]}>
            <Col xs={24} md={24}>
              <Card  title="Customer">
                {order.customer? <CustomerInfo customer={order.customer} /> :<Skeleton paragraph={{rows: 3}}/>}
              </Card>
            </Col>
            <Col xs={24} md={24}>
              <Card className='shadow' title="Images" style={{overflow: "auto"}}>
                {order.images && order.images.length ? <Row gutter={[16, 16]}>
                    {order.images.map(item => {
                      return <Col key={item.id}>
                        <Image
                          width={100}
                          height={100}
                          src={`${process.env.REACT_APP_API_BASE_URL}/files/upload/${item.id}`}/>
                      </Col>
                    })}
                  </Row> : <Empty description={"No image found."}/>}
              </Card>
            </Col>
          </Row>

        </Col>


      </Row>
    </>


  )
}

export default Order;
