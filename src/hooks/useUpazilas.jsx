import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { toast } from "react-toastify";

export const useUpazilas = (districtId) => {

  const [upazilas, setUpazilas] = useState([]);
  const [upazilaLoading, setUpazilaLoading] = useState(false);



    useEffect(() => {
      if (districtId) {
        setUpazilaLoading(true);

        axiosClient
          .get(`/getUpazilasByDistrict?districtId=${districtId}`)
          .then((response) => {
            setUpazilas([...response.data]);
            setUpazilaLoading(false);
          })
          .catch((error) => {
            const message =
              (error.response && error.response.data && error.response.data.message) ||
              error.message ||
              error.toString();
            toast.error(message);
            setUpazilaLoading(false);
          });
      } else {
        setUpazilas([]);
      }


    }, [districtId]);

    return {upazilas, upazilaLoading};

};
