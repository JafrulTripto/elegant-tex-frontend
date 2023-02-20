import {useEffect, useState} from "react";
import axiosClient from "../axios-client";
import {toast} from "react-toastify";

export const useDeliveryChannels = () => {

  const [deliveryChannels, setDeliveryChannels] = useState([]);

  const fetchDeliveryChannels = () => {
    axiosClient.get(`/settings/deliveryChannels/index`).then((response) => {
      setDeliveryChannels([...response.data.data])
    }).catch((error) => {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      toast.error(message);
    });
  }
  useEffect(()=> {
      fetchDeliveryChannels();
  },[])

  return {deliveryChannels}
}
