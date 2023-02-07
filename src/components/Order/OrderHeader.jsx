import React, {useState} from 'react';
import {Button, Tag} from "antd";
import {CalendarOutlined, DownloadOutlined} from "@ant-design/icons";
import moment from "moment/moment";
import {OrderStatusEnum} from "../../utils/enums/OrderStatusEnum";
import {colors} from "../../utils/Colors";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import logo from '../../assets/images/eleganttex-logo-only.png'


pdfMake.vfs = pdfFonts.pdfMake.vfs;

const getBase64ImageFromURL= (url) => {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.setAttribute("crossOrigin", "anonymous");

    img.onload = () => {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      var dataURL = canvas.toDataURL("image/png");

      resolve(dataURL);
    };

    img.onerror = error => {
      reject(error);
    };

    img.src = url;
  });
}
const OrderHeader = ({order}) => {
  const [pdfLoading, setPdfLoading] = useState(false);

  const generateTagColorFromStatus = (status) => {
    let obj = OrderStatusEnum.find(o => o.label === status);
    return obj.color;
  }
  const generatePDF = async () => {
    setPdfLoading(true);

    const {customer, products, payment} = order;
    const {address, name} = customer;
    const productData = products.map(product => [product.productType, product.productColor, product.productFabric, product.unit]);
    const docDefinition = {
      content: [
        {
          columns: [
            {
              image: await getBase64ImageFromURL('http://et.local/api/files/upload/2'),
              width: 150,
            },
            [
              {
                text: 'INVOICE',
                color: '#333333',
                width: '*',
                fontSize: 28,
                bold: true,
                alignment: 'right',
                margin: [0, 0, 0, 15],
              },
              {
                stack: [
                  {
                    columns: [
                      {
                        text: 'Order No.',
                        color: '#aaaaab',
                        bold: true,
                        width: '*',
                        fontSize: 12,
                        alignment: 'right',
                      },
                      {
                        text: `ET-ORD-${order.id}`,
                        bold: true,
                        color: '#333333',
                        fontSize: 12,
                        alignment: 'right',
                        width: 130,
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: 'Order Issued',
                        color: '#aaaaab',
                        bold: true,
                        width: '*',
                        fontSize: 12,
                        alignment: 'right',
                      },
                      {
                        text: `${moment(order.createdAt).format('MMMM Do YYYY')}`,
                        bold: true,
                        color: '#333333',
                        fontSize: 12,
                        alignment: 'right',
                        width: 130,
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: 'Delivery Date',
                        color: '#aaaaab',
                        bold: true,
                        width: '*',
                        fontSize: 12,
                        alignment: 'right',
                      },
                      {
                        text: `${moment(order.deliveryDate).format('MMMM Do YYYY')}`,
                        bold: true,
                        color: '#333333',
                        fontSize: 12,
                        alignment: 'right',
                        width: 130,
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: 'Status',
                        color: '#aaaaab',
                        bold: true,
                        fontSize: 12,
                        alignment: 'right',
                        width: '*',
                      },
                      {
                        text: `${order.status}`,
                        bold: true,
                        fontSize: 14,
                        alignment: 'right',
                        color: 'green',
                        width: 130,
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },
        {
          columns: [
            {
              text: 'From',
              color: '#aaaaab',
              bold: true,
              fontSize: 14,
              alignment: 'left',
              margin: [0, 20, 0, 5],
            },
            {
              text: 'To',
              color: '#aaaaab',
              bold: true,
              fontSize: 14,
              alignment: 'left',
              margin: [0, 20, 0, 5],
            },
          ],
        },
        {
          columns: [
            {
              text: `${order.orderable.name} \n Elegant Tex Ltd.`,
              bold: true,
              color: '#333333',
              alignment: 'left',
            },
            {
              text: `${order.customer.name} \n ${order.customer.facebook}`,
              bold: false,
              color: '#333333',
              alignment: 'left',
            },
          ],
        },
        {
          columns: [
            {
              text: 'Address',
              color: '#aaaaab',
              bold: true,
              margin: [0, 7, 0, 3],
            },
            {
              text: 'Address',
              color: '#aaaaab',
              bold: true,
              margin: [0, 7, 0, 3],
            },
          ],
        },
        {
          columns: [
            {
              text: '9999 Street name 1A \n New-York City NY 00000 \n   USA',
              style: 'invoiceBillingAddress',
            },
            {
              text: `${order.customer.address.address} \n ${order.customer.address.upazila}, ${order.customer.address.district}\n  ${order.customer.address.phone}, ${order.customer.altPhone}`,
              style: 'invoiceBillingAddress',
            },
          ],
        },
        '\n\n',
        {
          width: '100%',
          alignment: 'center',
          text: 'Invoice No. 123',
          bold: true,
          margin: [0, 10, 0, 10],
          fontSize: 15,
        },
        {
          layout: {
            defaultBorder: false,
            hLineWidth: function(i, node) {
              return 1;
            },
            vLineWidth: function(i, node) {
              return 1;
            },
            hLineColor: function(i, node) {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: function(i, node) {
              return '#eaeaea';
            },
            hLineStyle: function(i, node) {
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: function(i, node) {
              return 10;
            },
            paddingRight: function(i, node) {
              return 10;
            },
            paddingTop: function(i, node) {
              return 2;
            },
            paddingBottom: function(i, node) {
              return 2;
            },
            fillColor: function(rowIndex, node, columnIndex) {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['*', "*", 40],
            body: [
              [
                {
                  text: 'PRODUCT',
                  fillColor: '#eaf2f5',
                  border: [false, true, false, true],
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
                {
                  text: 'ITEM DESCRIPTION',
                  fillColor: '#eaf2f5',
                  border: [false, true, false, true],
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
                {
                  text: 'UNIT',
                  border: [false, true, false, true],
                  alignment: 'right',
                  fillColor: '#eaf2f5',
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
              ],
              ...order.products.map(product => {
                return [
                  {
                    text: `${product.productType}`,
                    border: [false, false, false, true],
                    margin: [0, 5, 0, 5],
                    alignment: 'left',
                  },
                  {
                    text: `${product.productColor} color, ${product.productFabric} fabric, ${product.description}`,
                    border: [false, false, false, true],
                    margin: [0, 5, 0, 5],
                    alignment: 'left',
                  },
                  {
                    border: [false, false, false, true],
                    text: `${product.unit} pc.`,
                    fillColor: '#f5f5f5',
                    alignment: 'right',
                    margin: [0, 5, 0, 5],
                  }
                ]
              }),
            ],
          },
        },
        '\n',
        '\n',
        {
          table:{
            body:[ await Promise.all(order.images.map(async (image) => {
              return {
                image: await getBase64ImageFromURL(`${process.env.REACT_APP_API_BASE_URL}/files/upload/${image.id}`),
                width: 100,
                height:100,
              }
            }))]
          },
          layout: 'noBorders'
        },
        '\n',
        '\n',
        {
          layout: {
            defaultBorder: false,
            hLineWidth: function(i, node) {
              return 1;
            },
            vLineWidth: function(i, node) {
              return 1;
            },
            hLineColor: function(i, node) {
              return '#eaeaea';
            },
            vLineColor: function(i, node) {
              return '#eaeaea';
            },
            hLineStyle: function(i, node) {
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: function(i, node) {
              return 10;
            },
            paddingRight: function(i, node) {
              return 10;
            },
            paddingTop: function(i, node) {
              return 2;
            },
            paddingBottom: function(i, node) {
              return 2;
            },
            fillColor: function(rowIndex, node, columnIndex) {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['*', 'auto'],
            body: [
              [
                {
                  text: 'Payment Subtotal',
                  border: [false, true, false, true],
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
                {
                  border: [false, true, false, true],
                  text: `${order.payment.amount} tk`,
                  alignment: 'right',
                  fillColor: '#f5f5f5',
                  margin: [0, 5, 0, 5],
                },
              ],
              [
                {
                  text: 'Delivery Charge',
                  border: [false, false, false, true],
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
                {
                  text: `${order.payment.deliveryCharge} tk`,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
              ],
              [
                {
                  text: 'Total Amount',
                  bold: true,
                  fontSize: 20,
                  alignment: 'right',
                  border: [false, false, false, true],
                  margin: [0, 5, 0, 5],
                },
                {
                  text:  `${order.payment.totalAmount} tk`,
                  bold: true,
                  fontSize: 20,
                  alignment: 'right',
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  margin: [0, 5, 0, 5],
                },
              ],
            ],
          },
        },
        '\n',
        {
          text: 'NOTES',
          style: 'notesTitle',
        },
        {
          text: 'Some notes goes here \n Notes second line',
          style: 'notesText',
        },
      ],
      styles: {
        notesTitle: {
          fontSize: 10,
          bold: true,
          margin: [0, 50, 0, 3],
        },
        notesText: {
          fontSize: 10,
        },
      },
      defaultStyle: {
        columnGap: 20,
        //font: 'Quicksand',
      },
    };
    setPdfLoading(false);
    pdfMake.createPdf(docDefinition).download();
  };
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h3 className="text-2xl text-stone-900">
            Order #{order.orderId}
          </h3>
          <div className="mb-3 pl-5 font-bold">
            <Tag color={generateTagColorFromStatus(order.status)}>{order.status}</Tag>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-zinc-500">
            <span className="text-sm font-thin">Ordered By:</span> {order.orderable.name}
          </div>
          <div className="pl-4">
            <Button style={{color: colors.secondary}} onClick={generatePDF} loading={pdfLoading} icon={<DownloadOutlined/>}
                    size={"small"}>Download PDF
            </Button>
          </div>
        </div>
      </div>
      <CalendarOutlined className="text-zinc-500 pr-1"/>
      <span className="text-zinc-500">{moment(order.createdAt).format('MMMM Do YYYY, h:mm a')}</span>
    </div>
  );
};

export default OrderHeader;
