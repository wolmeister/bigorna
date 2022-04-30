import { useState } from 'react';
import { Form, Input, Button, Layout, Menu, Spin } from 'antd';
import './styles.css';
import { Content, Header } from 'antd/lib/layout/layout';
import { useNavigate } from 'react-router-dom';
import { userService } from './userService';

import { notification } from 'antd';
import { LoadingOutlined, WarningOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 25 }} spin />;

export function SignUpPage() {
  const navigate = useNavigate();
  const [isOnRequest, setisOnRequest] = useState(false);

  const openNotification = (placement: any) => {
    notification.info({
      message: 'Registration failed!',
      description: '',
      placement,
      duration: 2,
      icon: <WarningOutlined style={{ color: 'red' }} />,
    });
  };

  const onFinish = async (values: any) => {
    setisOnRequest(true);
    try {
      const userInfos = await new userService().register(
        values.username,
        values.email,
        values.password
      );
      console.log('Sucesso');
      navigate('/signin');
    } catch (error) {
      //setisFail(true); // error mensage disable
      openNotification('bottomRight');
    }
    console.log('Success:', values);
    setisOnRequest(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
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
        <Form
          className="register_form"
          name="register_form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            tooltip="This will be the display name"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input disabled={isOnRequest} />
          </Form.Item>

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
            hasFeedback
            rules={[{ required: true, message: '' }]}
          >
            <Input.Password disabled={isOnRequest} />
          </Form.Item>
          <Form.Item
            label="Password Validation"
            name="passwordV"
            hasFeedback
            rules={[
              { required: true, message: 'Input your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords not match!'));
                },
              }),
            ]}
          >
            <Input.Password disabled={isOnRequest} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" disabled={isOnRequest}>
              Register
            </Button>
            {isOnRequest ? <Spin style={{ marginLeft: 5 }} indicator={antIcon} /> : ''}
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
}
