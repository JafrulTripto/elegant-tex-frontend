import React, {useState} from 'react';
import {Button, Col, Form, Input, InputNumber, Row, Select, Upload} from "antd";
import {InboxOutlined, MinusOutlined, PlusOutlined} from "@ant-design/icons";
import {colors} from "../../utils/Colors";
import {toast} from "react-toastify";
import axiosClient from "../../axios-client";
import {useProductColors} from "../../hooks/useProductColors";
import {useProductFabrics} from "../../hooks/useProductFabrics";
import {useProductTypes} from "../../hooks/useProductTypes";

const OrderProductForm = () => {

  const {Option} = Select;
  const {Dragger} = Upload;


  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const {productColors} = useProductColors();
  const {productFabrics} = useProductFabrics();
  const {productTypes} = useProductTypes();

  const draggerProps = {
    name: "orderImage",
    accept: "image/*",
    multiple: true,
    listType:"picture",
    action: `${process.env.REACT_APP_API_BASE_URL}/files/uploadProductImage`,
    maxCount: 5,
    onChange(info) {
      const {status} = info.file;
      console.log(status);
      if (status === 'uploading') {
        setLoading(true);
      }
      if (status === 'done') {
        setLoading(false);
        setFiles(info.fileList);
        toast.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        toast.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
    },
    onRemove(removedFile) {
      const imagePath = {
        imagePath: removedFile.response.path
      }
      setLoading(true);
      axiosClient.post(`/files/delete`, imagePath).then((response) => {

        toast.success(response.data.message);
        const updatedFilesList = files.filter((file) => file.uid !== removedFile.uid);
        setFiles(updatedFilesList);
        setLoading(false);
      }).catch((error) => {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        toast.error(message);
        setLoading(false);
      })


    }
  };

  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Row>
      <Col xs={24} md={12} lg={16} className="pr-4">
        <Form.List name="products" initialValue={[{
          productType: null,
          productColor: null,
          productFabric: null,
          productDescription: null
        }]}>
          {(fields, {add, remove}) => (
            <>
              {fields.map(({key, name, ...restField}) => (

                <Row gutter={24} key={key}>
                  <Col xs={24} md={12} lg={8}>
                    <Form.Item

                      name={[name, 'productType']}
                      label="Product Type"
                      rules={[
                        {
                          required: true,
                          message: 'Please select product type!',
                        },

                      ]}>
                      <Select>
                        {productTypes.map(data => {
                          return <Option value={data.id} key={data.id}>{data.name}</Option>
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={8}>
                    <Form.Item
                      name={[name, 'productColor']}
                      label="Product Color"
                      rules={[
                        {
                          required: true,
                          message: 'Please select product color!',
                        },

                      ]}>
                      <Select>
                        {productColors.map(data => {
                          return <Option value={data.id} key={data.id}>{data.name}</Option>
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={8}>
                    <Form.Item
                      name={[name, 'productFabric']}
                      label="Product Fabric"
                      rules={[
                        {
                          required: true,
                          message: 'Please select product fabric!',
                        },

                      ]}>
                      <Select>
                        {productFabrics.map(data => {
                          return <Option value={data.id} key={data.id}>{data.name}</Option>
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={16}>
                    <Form.Item
                      name={[name, 'productDescription']}
                      label="Product description"
                      rules={[
                        {
                          required: true,
                          message: 'Please input product description!',
                        },
                      ]}
                    >
                      <Input.TextArea rows={2} placeholder="Additional product information ..."/>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={4}>
                    <Form.Item
                      name={[name, "count"]}
                      label="Count"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter product count!',
                        },

                      ]}>
                      <InputNumber
                        min={1}
                        style={{width: "100%"}}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={4}>
                    <Form.Item
                      name={[name, "price"]}
                      label="Price"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter product price!',
                        },

                      ]}>
                      <InputNumber
                        min={1}
                        style={{width: "100%"}}
                      />
                    </Form.Item>
                  </Col>
                </Row>))}

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12} lg={12}>
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                      Add Another Product
                    </Button>

                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={12}>
                  <Form.Item>
                    <Button type="dashed" danger onClick={() => fields.length > 1 ? remove(fields.length - 1) : null}
                            disabled={fields.length <= 1} block icon={<MinusOutlined/>}>
                      Remove Last Product
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </>)}
        </Form.List>
      </Col>
      <Col xs={24} md={12} lg={8} className="pt-8">
        <Form.Item
          name="images"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Dragger {...draggerProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{color: colors.secondaryDark}}/>
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from uploading company data or other
              band files
            </p>
          </Dragger>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default OrderProductForm;
