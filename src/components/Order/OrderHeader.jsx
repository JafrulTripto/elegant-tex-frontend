import React from 'react';
import {Tag} from "antd";
import {CalendarOutlined} from "@ant-design/icons";
import moment from "moment/moment";

const OrderHeader = ({orderId, createdAt, status}) => {
  return (
    <div className="mb-3">
      <div className="flex items-center">
        <h3 className="text-2xl text-stone-900">
          Order #{orderId}
        </h3>
        <div className="mb-3 pl-5 font-bold">
          <Tag color="red">{status}</Tag>
        </div>
      </div>
      <CalendarOutlined className="text-zinc-500 pr-1"/>
      <span className="text-zinc-500">{moment(createdAt).format('MMMM Do YYYY, h:mm a')}</span>
    </div>
  );
};

export default OrderHeader;
