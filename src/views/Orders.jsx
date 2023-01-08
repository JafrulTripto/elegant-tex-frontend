import React, {useState, useEffect} from 'react';
import {Space, Card, Row, Col, Button, Input, Table, Tag, Tabs, Switch, Select, Modal} from 'antd';

import {NavLink, useNavigate} from "react-router-dom";


import {toast} from 'react-toastify';
import {PlusOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons'
import moment from 'moment';
import {useStateContext} from "../contexts/ContextProvider.jsx";
import axiosClient from "../axios-client.js";
import Permission from "../components/Util/Permission.jsx";
import {OrderTypeEnum} from "../utils/enums/OrderTypeEnum.js";
import {OrderStatusEnum} from "../utils/enums/OrderStatusEnum";


function Sales() {

  const {Search} = Input;
  const {user} = useStateContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState('Marketplace');
  const [orderStatus, setOrderStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderId, setOrderId] = useState(null);

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
  const showModal = (data, id) => {
    setOrderStatus(data);
    setIsModalOpen(true);
    setOrderId(id);
  };
  const handleOk = () => {
    const postData = {
      orderId,
      orderStatus
    }
    setStatusLoading(true);
    axiosClient.post('/orders/changeOrderStatus', postData).then((response) => {
      const order = response.data.data;
      const target = orders.find((obj) => obj.id === order.id);
      Object.assign(target, order);
      setOrderStatus(null);
      setStatusLoading(false)
      setIsModalOpen(false);
      toast.success("Succesfully changed order status to " + response.data.data.status);

    }).catch((error) => {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      toast.error(message);
      setStatusLoading(false)
    })

  };
  const handleCancel = () => {
    setIsModalOpen(false);
  }
  const handleStatusChange = (status) => {
    setOrderStatus(status);
  }

  const generateTagColorFromStatus = (status) => {
    let obj = OrderStatusEnum.find(o => o.label === status);
    return obj.color;
  }

  const renderStatus = (data, record, index) => {
    return <Tag color={generateTagColorFromStatus(data)} style={{cursor:"pointer"}} onClick={()=> showModal(data, record.id)}>{data}</Tag>
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
      render: renderStatus
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
      <Tabs defaultActiveKey="1" onChange={onTabChange} items={tabItems}></Tabs>
      <Modal title="Status" confirmLoading={statusLoading} width={400} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Select
          defaultValue={orderStatus}
          style={{ width: "100%" }}
          onChange={handleStatusChange}
          options={OrderStatusEnum}
        />
      </Modal>
    </Space>
  )
}

export default Sales
