import {useEffect, useState} from "react";
import axiosClient from "../axios-client";
import {toast} from "react-toastify";
import {useStateContext} from "../contexts/ContextProvider";

export const useMarketplaces = () => {

  const [marketplaces, setMarketplaces] = useState([]);
  const {user} = useStateContext();

  const fetchMarketplaces = () => {
    axiosClient.get(`/settings/marketplace/getUserMarketplaces?userID=${user.id}`).then((response) => {
      setMarketplaces([...response.data])
    }).catch((error) => {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      toast.error(message);
    });
  }
  useEffect(()=> {
    fetchMarketplaces();
  },[])

  return {marketplaces}
}
