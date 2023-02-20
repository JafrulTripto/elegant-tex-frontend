import React, {useState} from 'react';
import {Col, Form, Input, Row, Select} from "antd";
import {useDivisions} from "../../hooks/useDivisions";
import {useDistricts} from "../../hooks/useDistricts";
import {useUpazilas} from "../../hooks/useUpazilas";

const OrderCustomerForm = ({orderForm}) => {

  const {Option} = Select;

  const {divisions, divisionLoading} = useDivisions();

  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const {districts, districtLoading} = useDistricts(selectedDivision);
  const {upazilas, upazilaLoading} = useUpazilas(selectedDistrict);

  const onDivisionSelect = (data) => {
    orderForm.setFieldValue('district', null);
    orderForm.setFieldValue('upazila', null);
    setSelectedDivision(data);
    setSelectedDistrict(null);
  }
  const onDistrictSelect = (data) => {
    orderForm.setFieldValue('upazila', null);
    setSelectedDistrict(data);
  }

  return (
    <Row gutter={24}>
      <Col xs={24} md={12} lg={6}>
        <Form.Item
          name="name"
          label="Customer Name"
          rules={[
            {
              required: true,
              message: 'Please input customer name!',
            },
          ]}
        >
          <Input placeholder="Name"/>
        </Form.Item>
      </Col>
      <Col xs={24} md={12} lg={6}>
        <Form.Item
          name="facebookId"
          label="Facebook id"
          rules={[
            {
              required: true,
              message: 'Please input facebook id!',
            },
          ]}
        >
          <Input placeholder="Facebook id"/>
        </Form.Item>
      </Col>
      <Col xs={24} md={12} lg={6}>
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            {
              required: true,
              message: 'Please input phone number!',
            },
          ]}
        >
          <Input placeholder="Phone Number"/>
        </Form.Item>

      </Col>
      <Col xs={24} md={12} lg={6}>
        <Form.Item
          name="altPhone"
          label="Alernative Phone Number"
          rules={[
            {
              required: true,
              message: 'Please input Alernative phone number!',
            },
          ]}
        >
          <Input placeholder="Alernative Phone Number"/>
        </Form.Item>

      </Col>
      <Col xs={24} md={12} lg={12}>
        <Form.Item
          name="address"
          label="Address"
          rules={[
            {
              required: true,
              message: 'Please input address!',
            },
          ]}
        >
          <Input.TextArea placeholder="House, road, area...." rows={1}/>
        </Form.Item>
      </Col>
      <Col xs={24} md={12} lg={4}>
        <Form.Item
          name="division"
          label="Division"
          rules={[
            {
              required: true,
              message: 'Please select division!',
            },

          ]}>
          <Select loading={divisionLoading} onSelect={onDivisionSelect}>
            {divisions.map(data => {
              return <Option value={data.id} key={data.id}>{data.name}</Option>
            })}

          </Select>
        </Form.Item>
      </Col>
      <Col xs={24} md={12} lg={4}>
        <Form.Item
          name="district"
          label="District"
          rules={[
            {
              required: true,
              message: 'Please select district!',
            },

          ]}>
          <Select loading={districtLoading} onSelect={onDistrictSelect}>
            {districts.map(data => {
              return <Option value={data.id} key={data.id}>{data.name}</Option>
            })}

          </Select>
        </Form.Item>
      </Col>
      <Col xs={24} md={12} lg={4}>
        <Form.Item
          name="upazila"
          label="Upazila / Thana"
          rules={[
            {
              required: true,
              message: 'Please select district!',
            },

          ]}>
          <Select loading={upazilaLoading}>
            {upazilas.map(data => {
              return <Option value={data.id} key={data.id}>{data.name}</Option>
            })}

          </Select>
        </Form.Item>
      </Col>
    </Row>

  );
};

export default OrderCustomerForm;
