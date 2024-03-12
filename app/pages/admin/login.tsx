import type { NextPage } from 'next';
import axios, { AxiosResponse } from 'axios'
import { Form, Input, Button, Space, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Image from 'next/image'
import { useUserContext, getAuthorization } from '../../utilities/authorization';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from "jwt-decode";


const AdminLogin: NextPage = () => {
   const { Title } = Typography;
   const userContext = useUserContext();
   const router = useRouter()


   const onFinish = useCallback(async (values: any) => {
      try {
         const response: AxiosResponse<T> = await axios({
            method: 'post',
            url: process.env.BE_BASEURL + '/api/users/login',
            data: { usernameOrEmail: values.username, password: values.password },
            ...getAuthorization(userContext?.token || '')
         });

         if (response?.status === 201 && response.data.data) {
            const decodedJWT = jwtDecode(response.data.data.token);
            userContext.setUserContext({
               token: response.data.data.token,
               expireAt: decodedJWT.exp,
               ...decodedJWT.userData,
            })

            localStorage.setItem("token", JSON.stringify({
               token: response.data.data.token,
               expireAt: decodedJWT.exp,
               ...decodedJWT.userData,
            }));

            router.push('/admin')

         }

      } catch (e) {
         console.error(e)
      }
   }, [router, userContext]);

   const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
   };
   return (
      <Space direction="vertical">
         <center>
            <Image src="/Desa manud logo.png" width='180px' height='180px' style={{ display: 'flex' }} />
            <Title level={4} style={{ width: '450px' }}>Halaman login admin</Title>
            <br />
            <Form
               name="normal_login"
               className="login-form"
               initialValues={{
                  remember: true,
               }}
               onFinish={onFinish}
               style={{ width: '300px' }}
            >
               <Form.Item
                  name="username"
                  rules={[
                     {
                        required: true,
                        message: 'Silahkan masukkan username anda',
                     },
                  ]}
               >
                  <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
               </Form.Item>
               <Form.Item
                  name="password"
                  rules={[
                     {
                        required: true,
                        message: 'Silahkan masukkan password anda',
                     },
                  ]}
               >
                  <Input.Password
                     prefix={<LockOutlined className="site-form-item-icon" />}
                     type="password"
                     placeholder="Password"
                  />
               </Form.Item>
               <Form.Item>
                  <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>
                     Masuk
                  </Button>
               </Form.Item>
            </Form>
         </center>
      </Space>
   )
};

export default AdminLogin;
