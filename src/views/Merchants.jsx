

import { Card, Col, Row, Button, Table, Avatar, Space, Modal } from 'antd';
import { PlusOutlined, AntDesignOutlined, DeleteOutlined, EditOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import useAxios from '../../utils/useAxios';


function Merchants() {

  const navigate = useNavigate()
  const [Merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  let api = useAxios();

  useEffect(() => {
      fetchMerchants();
  },[])


  const addNewMerchant = () => {
      navigate('/merchants/new-merchant')
  }
  const fetchMerchants = async (page = 1) => {
      setLoading(true);
      try {
          const link = page > 1 ? `/Merchants/index?page=${page}` : "/merchants/index"
          const Merchants = await api.get(`${process.env.REACT_APP_BASE_URL}${link}`);
          setLoading(false);
          const MerchantData = Merchants.data.data.map((data) => {
              return { ...data, key: data.id }
          })
          setMerchants(MerchantData);
          setTotal(Merchants.data.total)
      } catch (error) {
          toast.error(error.response.data.message);
          setLoading(false);
      }
  }

  const renderMerchantAvater = (image) => {
    if (image) {
        const imagePath = `${process.env.REACT_APP_BASE_URL}/files/upload/${image.id}`
        return (
            <Avatar
                src={imagePath}
                size={{ xs: 24, sm: 32, md: 32 }}
            />

        )
    }
    return <Avatar size={{ xs: 24, sm: 32, md: 32 }} icon={<UserOutlined />} />

}

const renderActionButtons = (record) => {
    return (
        <Space size="middle">
            <Button className='edit-btn' icon={<EditOutlined />} size={"small"} onClick={() => handleEditMerchant(record)} />
            <Button type="danger" icon={<DeleteOutlined />} size={"small"} onClick={() => handleDeleteMerchant(record)} />
        </Space>
    );
}

const confirmDeleteMerchant = async (id) => {
  try {
      const url = `/Merchants/delete?id=${id}`;
      const data = await api.get(`${process.env.REACT_APP_BASE_URL}${url}`);
      toast.warning(data.data.message);
      fetchMerchants();

  } catch (error) {
      toast.error(error.response.statusText);
  }
}


  const columns = [
    {
        title: 'Merchant',
        dataIndex: 'image',
        key: 'image',
        render: renderMerchantAvater
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Identification',
        dataIndex: 'identification',
        key: 'nid',
    },
    {
        title: 'Phone',
        dataIndex: 'address',
        key: 'phone',
        render: (address) => `${address.phone}`
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        render: (address) => `${address.address} ,${address.district}, ${address.division}`
    },
    {
        title: 'Action',
        key: "action",
        render: renderActionButtons
    }
];

const handleEditMerchant = (record) => {
}
const handleDeleteMerchant = (record) => {
    Modal.confirm({
        title: 'Are you sure want to delete this Merchant data?',
        okText: "Yes",
        okType: "danger",
        onOk: () => confirmDeleteMerchant(record.id)
    })
}


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
                    <Col xs={{ span: 24 }} lg={{ span: 20 }}></Col>
                    <Col xs={{ span: 24 }} lg={{ span: 4 }} flex={"inherit"}>
                        <Button type="primary" onClick={addNewMerchant} icon={<PlusOutlined />}>Add Merchant</Button>
                    </Col>
                </Row>
            </Card>
            <Card className='shadow'>
                <Table
                    dataSource={Merchants}
                    columns={columns}
                    loading={loading}
                    scroll={{ x: 400 }}
                    size={'small'}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: total,
                        onChange: (page, pageSize) => {
                            setPage(page)
                            setPageSize(pageSize)
                            fetchMerchants(page)
                        }
                    }}
                />
            </Card>
        </Space>
  )
}

export default Merchants;