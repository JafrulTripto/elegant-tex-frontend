import React, {useEffect, useState} from 'react';
import {Navigate, Outlet, useNavigate, useLocation} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import { Layout, Menu, Modal, theme} from "antd";
import {
  MenuFoldOutlined, MenuUnfoldOutlined, DashboardFilled, ShoppingFilled, UserOutlined, SettingFilled, ShopOutlined,
} from '@ant-design/icons';
import axiosClient from "../../axios-client.js";
import Loading from "../Util/Loading.jsx";
import {toast} from "react-toastify";
import {ElegantTexIcon} from "../../utils/icons/ElegantTexIcon";
import NavigationDropdown from "../NavigationDropdown";
import BreadCrumb from "../BreadCrumb";
import {colors} from "../../utils/Colors";


const {Header, Sider, Content} = Layout;

const DefaultLayout = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const route = location.pathname.split('/');

  const [collapsed, setCollapsed] = useState(false);
  const [navbarWidth, setNavbarWidth] = useState("");
  const [navbarLeft, setNavbarLeft] = useState("");

  const {
    token: {colorBgContainer},
  } = theme.useToken();

  const routes = [
    {
      key: 'dashboard', icon: <DashboardFilled style={{color:colors.secondary, fontSize:"22px"}}/>, label: 'Dashboard',
    },
    {
      key: 'merchants', icon: <ShopOutlined style={{color:colors.secondary, fontSize:"22px"}}/>, label: 'Merchants',
    },
    {
      key: 'orders', icon: <ShoppingFilled style={{color:colors.secondary, fontSize:"22px"}}/>, label: 'Orders',
    },
    {
      key: 'users', icon: <UserOutlined style={{color:colors.secondary, fontSize:"22px"}}/>, label: 'Users',
    },
    {
      key: 'settings', icon: <SettingFilled style={{color:colors.secondary, fontSize:"22px"}}/>, label: 'Settings',
    }
  ];




  const [loading, setLoading] = useState(false);

  const {user, token, setUser, setPermissions, setRoles, setToken} = useStateContext();

  useEffect(() => {

    if (collapsed) {
      setNavbarWidth("calc(100% - 82px)")
      setNavbarLeft("82px")
    } else {
      setNavbarWidth("calc(100% - 250px)")
      setNavbarLeft("250px")
    }
    if (token) {
      axiosClient.get('/user').then(({data}) => {
        setUser(data.user);
        setPermissions(data.permissions);
        setRoles(data.roles);
      }).catch(error => {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        toast.error(message);
      })
    }
  }, [])

  if (!token) {
    return <Navigate to="/login"/>
  }


  const sidebarCollapseToggle = () => {
    setCollapsed(!collapsed)
    if (collapsed) {
      setNavbarWidth("calc(100% - 250px)");
      setNavbarLeft("250px")
    } else {
      setNavbarWidth("calc(100% - 82px)");
      setNavbarLeft("82px")
    }
  }
  const onBreakpointHandler = (broken) => {
    if (broken) {
      setNavbarWidth("calc(100% - 82px)");
      setNavbarLeft("82px")
    }
    setCollapsed(broken)
  }


  const handleLogout = (e) => {
    e.preventDefault();
    Modal.confirm({
      title: 'Do you want to logout?',
      okText: "Yes",
      okType: "primary",
      okButtonProps: {danger: true},
      onOk: () => confirmLogout()
    })
  }
  const confirmLogout = () => {

    setLoading(true);
    axiosClient.post(`/auth/logout`).then(res => {
      toast.success(res.data.message);
      setUser(null)
      setToken(null);
      setLoading(false);
    }).catch(error => {
      setToken(null);
      setUser(null);
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      toast.error(message);
      setLoading(false);

    })

  }

  if (loading) {
    return <Loading/>
  }
  return (<Layout style={{minHeight: "100vh"}}>
    <Sider
      style={{
        overflow: "auto", height: "100vh", position: "sticky", top: 0, left: 0
      }}
      trigger={null}
      collapsible
      breakpoint={'sm'}
      width={250}
      collapsedWidth={70}
      onBreakpoint={onBreakpointHandler}
      collapsed={collapsed}>
      <div style={{padding: "5px", display: "flex"}}>
        <ElegantTexIcon/>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={route[1] === '' ? 'dashboard' : route[1]}
        items={routes}
        onClick={(item) => navigate("/" + item.key)}
      />
    </Sider>
    <Layout className="site-layout">
      <Header
        style={{
          position: 'fixed',
          zIndex: 1000,
          width: navbarWidth,
          padding: "0 20px",
          background: colorBgContainer,
          transition: "350ms"
        }}>
        <div className="flex justify-between">
          <div>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger', onClick: sidebarCollapseToggle,
            })}
          </div>
          {user && Object.keys(user).length !== 0 ? <NavigationDropdown user={user} handleLogout={handleLogout}/>: null}
        </div>
      </Header>
      <BreadCrumb/>
      <Content
        className="sm:px-1 md:px-5 lg:px-5 mx-2 py-5"
        style={{
          minHeight: 280, background: "#f5f5f5",
        }}>
        {user && Object.keys(user).length !== 0 ? <Outlet/> : <Loading layout='default'/>}
      </Content>
    </Layout>
  </Layout>);
};

export default DefaultLayout;


