import React from 'react';
import {OrderTypeEnum} from "../../utils/enums/OrderTypeEnum";
import {Col, Form, Row, Select} from "antd";
import {useMarketplaces} from "../../hooks/useMarketplaces";
import {useMerchants} from "../../hooks/useMerchants";

const OrderTypeFrom = ({orderType, From}) => {

  const {marketplaces} = useMarketplaces();
  const {merchants} = useMerchants();
  const {Option} = Select;

  return (
    <Row gutter={24}>
       <Col xs={24} md={12} lg={5}>
         {orderType === OrderTypeEnum.MARKETPLACE ? <Form.Item
          name="marketplace"
          label="Marketplace"
          rules={[
            {
              required: true,
              message: 'Please select marketplace!',
            },

          ]}>
          <Select>
            {marketplaces.map(data => {
              return <Option value={data.id} key={data.id}>{data.name}</Option>
            })}
          </Select>
        </Form.Item> : <Form.Item
           name="merchant"
           label="Merchant"
           rules={[
             {
               required: true,
               message: 'Please input customer name!',
             },
           ]}
         >
           <Select>
             {merchants.map(data => {
               return <Option value={data.id} key={data.id}>{data.name}</Option>
             })}
           </Select>
         </Form.Item>}
      </Col>
    </Row>
  );
};

export default OrderTypeFrom;
