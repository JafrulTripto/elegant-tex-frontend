import {Button, Card, Checkbox, Col, DatePicker, Form, Input, Layout, Row, Space, Typography} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {colors} from "../utils/Colors.js";
import {useNavigate} from "react-router-dom";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import {toast} from "react-toastify";
import {useState} from "react";
import Loading from "../components/Util/Loading";
import elegantTexLogo from '../assets/images/eleganttex-logo-only.png'


export default function Login() {

  const navigate = useNavigate();

  const {setToken, setUser} = useStateContext();

  const [loading, setLoading] = useState(false);
  const { Title, Text } = Typography;

  const onFinish = (values) => {
    const payload = {
      email: values.email,
      password: values.password
    }
    setLoading(true);
    axiosClient.post('auth/login', payload).then(({data}) => {
      setToken(data.access_token, data.expires_in);
      setLoading(false);
    }).catch(error => {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      toast.error(message);
      console.log(message)
      setLoading(false);
    })
  };

  const onFinishFailed = (errorInfo) => {
  };

  if (loading) {
    return <Loading />
  }
  return (
    <Layout style={{height: "100vh"}}>
      <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
        <Col xl={6} md={12} sm={12} xs={24}>
          <div className={"padding-md"}>
            <Card className="shadow" headStyle={{color:colors.primary, textAlign:'center', fontSize:'30px', fontWeight:'bolder'}}>
              <div style={{width:"auto", textAlign:"center"}}>
                <img src={elegantTexLogo} alt="ET-LOGO" style={{height:"35px", marginLeft:"auto", marginRight:"auto", maxWidth:"100%"}}/>
              </div>
              <div className="text-center">
                <div className="margin-bottom-md">
                  <Title level={3} >Welcome back!</Title>
                  <Text type="secondary" >Please enter your credentials to sign in!</Text>
                </div>
              </div>
              <Form
                name="login"
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your email!',
                    },
                  ]}
                >
                  <Input size={"large"} prefix={<UserOutlined style={{color: colors.primary}} className="site-form-item-icon"/>}
                         placeholder="Email"/>
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password!',
                    },
                  ]}
                >
                  <Input size={"large"} prefix={<LockOutlined style={{color: colors.primary}} className="site-form-item-icon"/>}
                         type="password"
                         placeholder="Password"/>
                </Form.Item>

                <Row>
                  <Col xl={16} md={12} sm={12}>
                    <Form.Item
                      name="remember"
                      valuePropName="checked"
                    >
                      <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col xl={8} md={12} sm={12} type="flex" align="end">
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Sign In
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </div>

        </Col>
      </Row>
    </Layout>
  )
}
