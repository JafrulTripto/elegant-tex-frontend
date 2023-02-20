import {useEffect, useState} from "react";
import axiosClient from "../axios-client";
import {toast} from "react-toastify";
import {useStateContext} from "../contexts/ContextProvider";

export const useProductColors = () => {

  const [productColors, setProductColors] = useState([]);
  const {user} = useStateContext();

  const fetchProductColors = () => {
    axiosClient.get(`/settings/colors/index`).then((response) => {
      setProductColors([...response.data.data])
    }).catch((error) => {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      toast.error(message);
    });
  }
  useEffect(()=> {
    fetchProductColors();
  },[])

  return {productColors}
}
