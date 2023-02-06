import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`
});

async function refreshToken() {
  try {
    const expiryTime = localStorage.getItem("TOKEN_EXPIRATION");
    const token = localStorage.getItem("ACCESS_TOKEN");

    const timeLeft = new Date(expiryTime) - new Date();

    if (expiryTime && timeLeft < 60 * 1000) { // less than 60 seconds
      const res = await axiosClient.post("/auth/refresh", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(res)
      localStorage.setItem("ACCESS_TOKEN", res.data.access_token);
      localStorage.setItem("TOKEN_EXPIRATION", new Date(Date.now() + res.data.expires_in * 1000));
    }
  } catch (error) {
    console.error(error);
  }
}

axiosClient.interceptors.request.use( (config) => {
  const token = localStorage.getItem('ACCESS_TOKEN');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
})

axiosClient.interceptors.response.use((res) => {
  if (res.config.url !== '/auth/refresh') {
    refreshToken()
  }

  return res;
}, (error) => {
  try {
    const {response} = error;
    if (response.status === 401) {
      localStorage.removeItem("ACCESS_TOKEN");
      localStorage.removeItem("TOKEN_EXPIRATION");
    }
  } catch (e) {
    console.error(e);
  }

  throw error;
})

export default axiosClient;
