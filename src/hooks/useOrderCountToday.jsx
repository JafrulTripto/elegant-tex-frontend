import {useEffect, useState} from "react";
import axiosClient from "../axios-client";
import {toast} from "react-toastify";

export const useOrderCountToday = () => {

  const [orderCountToday, setOrderCountToday] = useState(null);

  const fetchOrderCountToday = () => {
    axiosClient.get(`/dashboard/getOrderCountToday`).then((response) => {
      setOrderCountToday(response.data)
      console.log(response)
    }).catch((error) => {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      toast.error(message);
    });
  }
  useEffect(()=> {
    fetchOrderCountToday();
  },[])

  return {orderCountToday}
}
