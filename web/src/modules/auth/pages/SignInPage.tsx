import { useState } from 'react';
import { Form, Input, Button, Checkbox, Layout, Menu, Alert, Col, Spin } from 'antd';
import './styles.css';
import { Content, Header } from 'antd/lib/layout/layout';
import { useNavigate } from 'react-router-dom';
import { userService } from './userService';

import { notification } from 'antd';
import { LoadingOutlined, WarningOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 25 }} spin />;

export function SignInPage() {
  const navigate = useNavigate();
  const [isFail, setisFail] = useState(false);
  const [isOnRequest, setisOnRequest] = useState(false);

  const openNotification = (placement: any) => {
    notification.info({
      message: 'Wrong username or password',
      description: '',
      placement,
      duration: 2,
      icon: <WarningOutlined style={{ color: 'red' }} />,
    });
  };

  const onFinish = async (values: any) => {
    setisOnRequest(true);
    try {
      const userInfos = await new userService().login(values.email, values.password);
      console.log(userInfos);
      navigate('/');
    } catch (error) {
      //setisFail(true); // error mensage disable
      openNotification('bottomRight');
    }
    setisOnRequest(false);
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onRegister = () => {
    navigate('/signup');
  };

  const onForgetPassword = () => {
    navigate('/password-recovery');
  };

  return (
    <Layout style={{ height: '100%' }}>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <div className="logo">
          <a href="/">
            <img width={40} src="/favicon.png" />
          </a>
        </div>
        <Menu theme="dark" mode="horizontal"></Menu>
      </Header>
      <Content className="site-layout" style={{ padding: '0 0px', marginTop: 200 }}>
        {isFail ? (
          <Col span={8} offset={8}>
            <Alert
              style={{ marginBottom: 16 }}
              message="Wrong username or password"
              type="error"
              showIcon
            />
          </Col>
        ) : (
          ''
        )}
        <Form
          className="login_form"
          name="login_form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please input a valid email!' },
            ]}
          >
            <Input disabled={isOnRequest} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password disabled={isOnRequest} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Remember me</Checkbox>
            <Button type="link" onClick={onForgetPassword}>
              Forget password?
            </Button>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" disabled={isOnRequest}>
              Login
            </Button>
            <Button type="link" onClick={onRegister}>
              Sign Up
            </Button>
            {isOnRequest ? <Spin style={{ marginLeft: 5 }} indicator={antIcon} /> : ''}
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
}
