import React from 'react';
import {Tag} from "antd";
import {CalendarOutlined} from "@ant-design/icons";
import moment from "moment/moment";
import {OrderStatusEnum} from "../../utils/enums/OrderStatusEnum";

const OrderHeader = ({orderId, createdAt, status, orderable}) => {
  const generateTagColorFromStatus = (status) => {
    let obj = OrderStatusEnum.find(o => o.label === status);
    return obj.color;
  }
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h3 className="text-2xl text-stone-900">
            Order #{orderId}
          </h3>
          <div className="mb-3 pl-5 font-bold">
            <Tag color={generateTagColorFromStatus(status)}>{status}</Tag>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-zinc-500">
            <span className="text-sm font-thin">Ordered By:</span> {orderable.name}
          </div>
        </div>
      </div>
      <CalendarOutlined className="text-zinc-500 pr-1"/>
      <span className="text-zinc-500">{moment(createdAt).format('MMMM Do YYYY, h:mm a')}</span>
    </div>
  );
};

export default OrderHeader;
