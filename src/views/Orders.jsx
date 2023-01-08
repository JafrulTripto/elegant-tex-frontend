import React, {useState, useEffect} from 'react';
import {Space, Card, Row, Col, Button, Input, Table, Tag, Tabs} from 'antd';

import {NavLink, useNavigate} from "react-router-dom";


import {toast} from 'react-toastify';
import {PlusOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons'
import moment from 'moment';
import {useStateContext} from "../contexts/ContextProvider.jsx";
import axiosClient from "../axios-client.js";
import Permission from "../components/Util/Permission.jsx";
import {OrderTypeEnum} from "../utils/enums/OrderTypeEnum.js";


function Sales() {

  const {Search} = Input;
  const {user} = useStateContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState('Marketplace');

  const handleNewOrder = (orderType) => {
    navigate('/orders/orderForm', {state: {orderType}})
  }

  useEffect(() => {

    if (user) {
      fetchOrders();
    }

  }, [user])

  const fetchOrders = async (page = 1, type = 'Marketplace') => {
    setLoading(true);
    let link = '';
    const userId = user.id;
    if (type === 'Marketplace') {
      link = page > 1 ? `/orders/getMarketplaceOrders/${userId}?page=${page}` : `/orders/getMarketplaceOrders/${userId}`;
    } else {
      link = page > 1 ? `/orders/getMerchantOrders?page=${page}` : `/orders/getMerchantOrders`;

    }

    try {
      const orders = await axiosClient.get(link);
      setLoading(false);
      const ordersData = orders.data.data.map((data) => {
        return {...data, key: data.id}
      })
      console.log(ordersData)
      setOrders(ordersData);
      setTotal(orders.data.meta.total)
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      toast.error(message);
      setLoading(false);
    }
  }

  const handleEditOrder = (record) => {
  }
  const handleDeleteOrder = (record) => {
  }


  const renderActionButtons = (record) => {
    return (
      <Space size="middle">
        <Button className='edit-btn' icon={<EditOutlined/>} size={"small"} onClick={() => handleEditOrder(record)}/>
        <Button type="danger" icon={<DeleteOutlined/>} size={"small"} onClick={() => handleDeleteOrder(record)}/>
      </Space>
    );
  }

  const onTableRowClick = (order, record) => {
  }

  const onSearch = async (value, page = 1) => {
    if (value) {
      setLoading(true);
      const userId = user.id;
      try {
        let link = '';
        if (orderType === 'Marketplace') {
          link = page > 1 ? `/orders/getMarketplaceOrders/${userId}?page=${page}&search=${value}` : `/orders/getMarketplaceOrders/${userId}?search=${value}`;
        } else {
          link = page > 1 ? `/orders/getMerchantOrders?page=${page}&search=${value}` : `/orders/getMerchantOrders?search=${value}`;

        }
        const orders = await axiosClient.get(link);
        setLoading(false);
        const ordersData = orders.data.data.map((data) => {
          return {...data, key: data.id}
        })
        setOrders(ordersData);
        setTotal(orders.data.meta.total)
      } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        toast.error(message);
        setLoading(false);
      }
    }
  };

  const onTabChange = (key) => {
    const orderType = key === 1 ? 'Marketplace' : 'Merchant'
    setOrderType(orderType);
    fetchOrders(1, orderType);
  }


  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'orderId',
      render: (data) => <NavLink to={`${data}`}>{'ET-ORD-' + data}</NavLink>
    },
    {
      title: 'Ordered By',
      dataIndex: 'orderedBy',
      key: 'orderedBy',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (data) => <Tag color="red">{data}</Tag>
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Order Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (data) => moment(data).format('LL')
    },
    {
      title: 'Delivery Date',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      render: (data) => moment(data).format('LL')
    },
    {
      title: 'Total Amount (Tk)',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    },
    {
      title: 'Action',
      key: "action",
      render: renderActionButtons
    }
  ];

  const tabItems = [
    {
      label: `Marketplace`,
      key: 1,
      children:  <Table
        dataSource={orders}
        columns={columns}

        loading={loading}
        scroll={{x: 400}}
        size={'small'}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: (page, pageSize) => {
            setPage(page)
            setPageSize(pageSize)
            fetchOrders(page)
          }
        }}
      />,
    },
    {
      label: `Merchant`,
      key: 2,
      children: <Table
        dataSource={orders}
        columns={columns}

        loading={loading}
        scroll={{x: 400}}
        size={'small'}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: (page, pageSize) => {
            setPage(page)
            setPageSize(pageSize)
            fetchOrders(page, 'Merchant')
          }
        }}
      />,
    }
  ];


  return (
    <Space
      direction="vertical"
      size="middle"
      style={{
        display: 'flex',
      }}
    >
      <Card className='shadow'>
        <Row justify='space-between'>
          <Col xs={{span: 24}} lg={{span: 6}}>
            <Search placeholder="Search orders . . ." onSearch={onSearch} enterButton/>
          </Col>
          <Col xs={{span: 24}} lg={{span: 12}} flex={"inherit"}>
            <Space>
              <Permission required={'CREATE_MERCHANT_ORDER'}>
                <Button type="primary" ghost onClick={() => handleNewOrder(OrderTypeEnum.MERCHANT)}
                        icon={<PlusOutlined/>}>Merchant Order</Button>
              </Permission>
              <Permission required={'CREATE_MARKETPLACE_ORDER'}>
                <Button type="primary" onClick={() => handleNewOrder(OrderTypeEnum.MARKETPLACE)} icon={<PlusOutlined/>}>Marketplace
                  Order</Button>
              </Permission>
            </Space>
          </Col>
        </Row>
      </Card>
      <Tabs defaultActiveKey="1" onChange={onTabChange} items={tabItems}>

      </Tabs>
    </Space>
  )
}

export default Sales
