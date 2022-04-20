import { useState } from 'react';
import { Form, Input, Button, Checkbox, Row, Layout, Menu } from 'antd';
import './styles.css';
import { Content, Header } from 'antd/lib/layout/layout';
import { useNavigate } from 'react-router-dom';

export function SignInPage() {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
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
        <div className="logo" />
        <Menu theme="dark" mode="horizontal"></Menu>
      </Header>
      <Content className="site-layout" style={{ padding: '0 0px', marginTop: 200 }}>
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
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Remember me</Checkbox>
            <Button type="link" onClick={onForgetPassword}>
              Forget password?
            </Button>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
            <Button type="link" onClick={onRegister}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
}
