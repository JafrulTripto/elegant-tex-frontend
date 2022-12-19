import React from 'react';
import {Spin} from "antd";
import {Loading3QuartersOutlined} from '@ant-design/icons';
import {colors} from "../../utils/Colors";

const antIcon = <Loading3QuartersOutlined style={{fontSize: 56}} spin/>;
const Loading = (props) => {
  const calculateHeight = () =>{
    if (props.layout === 'default'){
      return "calc(100vh - 144px)";
    }
    return "100vh";
  }
  console.log(props)
  return (
    <>
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: calculateHeight(), flexDirection: "column"}}>
        <Spin indicator={antIcon} size="large"/>
        <span style={{paddingTop:"15px",paddingLeft:"15px", fontWeight:"bold", fontSize:"20px" , color: colors.primary}}>Loading . . .</span>
      </div>
    </>
  );
};

export default Loading;
