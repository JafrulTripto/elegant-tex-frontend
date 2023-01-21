import React from 'react';

const CustomerInfo = ({customer}) => {
  return (
    <div className='flex flex-col'>
      <div className='text-2xl font-semibold text-zinc-700'>{customer.name}</div>
      <a href={customer.facebook}>{customer.facebook}</a>
      <hr className="mb-3"/>
      <span>{customer.address.address}, {customer.address.upazila}, {customer.address.district}, {customer.address.division}</span>
      <span>phone: {customer.address.phone}, {customer.altPhone}</span>
    </div>
  );
};

export default CustomerInfo;
