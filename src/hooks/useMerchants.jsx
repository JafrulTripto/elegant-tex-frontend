import {useEffect, useState} from "react";
import axiosClient from "../axios-client";
import {toast} from "react-toastify";
import {useStateContext} from "../contexts/ContextProvider";

export const useMerchants = () => {

  const [merchants, setMerchants] = useState([]);
  const {user} = useStateContext();

  const fetchMerchants = () => {
    axiosClient.get(`/merchants/getMerchants`).then((response) => {
      setMerchants([...response.data.data])
    }).catch((error) => {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      toast.error(message);
    });
  }
  useEffect(() => {
    fetchMerchants();
  }, [])

  return {merchants};
}
