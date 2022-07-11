// import { ReactNode, useState } from 'react';
// import { Form, Input, Button, Layout, Menu } from 'antd';
// import './styles.css';
// import { Content, Header } from 'antd/lib/layout/layout';
// import { useNavigate } from 'react-router-dom';
// import { userService } from './userService';

// import { notification } from 'antd';
// import { LoadingOutlined, WarningTwoTone, ExclamationCircleTwoTone } from '@ant-design/icons';

// const antIcon = <LoadingOutlined style={{ fontSize: 25 }} spin />;

// export function PasswordRecoveryPage() {
//   const navigate = useNavigate(); //
//   const [isOnRequest, setisOnRequest] = useState(false);

//   const openNotification = (placement: any, message: string, icon: ReactNode) => {
//     notification.info({
//       message,
//       description: '',
//       placement,
//       duration: 2,
//       icon: icon,
//     });
//   };

//   const onFinish = async (values: any) => {
//     setisOnRequest(true);
//     try {
//       const userInfos = await new userService().passwordRecovery(values.email);
//       openNotification(
//         'bottomRight',
//         'An email has been sent to your account with a new password',
//         <ExclamationCircleTwoTone twoToneColor="#0000ff " />
//       );
//       console.log(userInfos);
//     } catch (error) {
//       openNotification(
//         'bottomRight',
//         'There is not even an account linked to this email',
//         <WarningTwoTone twoToneColor="#FF0000" />
//       );
//     }
//     setisOnRequest(false);
//     console.log('Success:', values);
//   };

//   const onFinishFailed = (errorInfo: any) => {
//     console.log('Failed:', errorInfo);
//   };

//   return (
//     <Layout style={{ height: '100%' }}>
//       <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
//         <div className="logo">
//           <a href="/">
//             <img width={40} src="/favicon.png" />
//           </a>
//         </div>
//         <Menu theme="dark" mode="horizontal"></Menu>
//       </Header>
//       <Content className="site-layout" style={{ padding: '0 0px', marginTop: 200 }}>
//         <Form
//           className="login_form"
//           name="login_form"
//           labelCol={{ span: 8 }}
//           wrapperCol={{ span: 8 }}
//           initialValues={{ remember: true }}
//           onFinish={onFinish}
//           onFinishFailed={onFinishFailed}
//           autoComplete="off"
//         >
//           <Form.Item
//             label="Email"
//             name="email"
//             rules={[
//               { required: true, message: 'Please input your email!' },
//               { type: 'email', message: 'Please input a valid email!' },
//             ]}
//           >
//             <Input disabled={isOnRequest} />
//           </Form.Item>

//           <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
//             <Button
//               type="primary"
//               htmlType="submit"
//               disabled={isOnRequest}
//               block
//               loading={isOnRequest}
//             >
//               Recovery password
//             </Button>
//           </Form.Item>
//         </Form>
//       </Content>
//     </Layout>
//   );
// }

export {};
