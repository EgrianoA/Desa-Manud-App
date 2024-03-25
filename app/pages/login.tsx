import type { NextPage } from "next";
import axios, { AxiosResponse } from "axios";
import { Form, Input, Button, Space, Typography } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useUserContext, getAuthorization } from "../utilities/authorization";
import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

const Login: NextPage = () => {
  const { Title } = Typography;
  const [isLogin, setIsLogin] = useState(true);

  const userContext = useUserContext();
  const router = useRouter();

  const onFinish = useCallback(
    async (values: any) => {
      if (isLogin) {
        try {
          const response: AxiosResponse<T> = await axios({
            method: "post",
            url: process.env.BE_BASEURL + "/api/users/login",
            data: {
              usernameOrEmail: values.username,
              password: values.password,
            },
          });

          if (response?.status === 201 && response.data.data) {
            const decodedJWT = jwtDecode(response.data.data.token);
            userContext.setUserContext({
              token: response.data.data.token,
              expireAt: decodedJWT.exp,
              ...decodedJWT.userData,
            });

            localStorage.setItem(
              "token",
              JSON.stringify({
                token: response.data.data.token,
                expireAt: decodedJWT.exp,
                ...decodedJWT.userData,
              })
            );

            router.push("/");
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        try {
          const response: AxiosResponse<T> = await axios({
            method: "post",
            url: process.env.BE_BASEURL + "/api/users/register",
            data: {
              username: values.username,
              email: values.password,
              password: values.password,
              userFullName: values.userFullName,
              role: "publicUser",
            },
          });

          if (response?.status === 201 && response.data.data) {
            const decodedJWT = jwtDecode(response.data.data.token);
            userContext.setUserContext({
              token: response.data.data.token,
              expireAt: decodedJWT.exp,
              ...decodedJWT.userData,
            });

            localStorage.setItem(
              "token",
              JSON.stringify({
                token: response.data.data.token,
                expireAt: decodedJWT.exp,
                ...decodedJWT.userData,
              })
            );

            router.push("/");
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    [isLogin, router, userContext]
  );

  return (
    <Space direction="vertical">
      <center>
        <Image
          src="/Desa manud logo.png"
          width="180px"
          height="180px"
          style={{ display: "flex" }}
        />
        {isLogin && (
          <>
            <Title level={4} style={{ width: "450px" }}>
              Halaman login
            </Title>
            <br />
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              style={{ width: "300px" }}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Silahkan masukkan username anda",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Silahkan masukkan password anda",
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
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  style={{ width: "100%" }}
                >
                  Masuk
                </Button>
                <Button
                  type="default"
                  className="register-form-button"
                  style={{ width: "100%" }}
                  onClick={() => setIsLogin(false)}
                >
                  <span>Daftar akun baru</span>
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
        {!isLogin && (
          <>
            <Title level={4} style={{ width: "450px" }}>
              Daftar akun baru
            </Title>
            <br />
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              style={{ width: "300px" }}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Silahkan masukkan username anda",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "Silahkan masukkan email anda dengan sesuai",
                  },
                  {
                    required: true,
                    message: "Silahkan masukkan email anda",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Silahkan masukkan password anda",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item
                name="userFullName"
                rules={[
                  {
                    required: true,
                    message: "Silahkan masukkan nama lengkap anda",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Nama Lengkap"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  style={{ width: "100%" }}
                >
                  Daftar
                </Button>
                <Button
                  type="default"
                  className="register-form-button"
                  style={{ width: "100%" }}
                  onClick={() => setIsLogin(true)}
                >
                  <span>Saya sudah punya akun</span>
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </center>
    </Space>
  );
};

export default Login;
