import React from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider} from 'react-router-dom';
import './index.css'
import router from "./router.jsx";
import {ContextProvider} from "./contexts/ContextProvider";
import 'antd/dist/reset.css';
import {ConfigProvider} from "antd";
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ContextProvider>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00b96b',
        },
      }}>
      <RouterProvider router={router}/>
    </ConfigProvider>
  </ContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
