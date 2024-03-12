import type { NextPage } from 'next';
import { Form, Input, Button, Space, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Image from 'next/image'


const Login: NextPage = () => {
    const { Title } = Typography;
    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Space direction="vertical">
            <Image src="/Desa manud logo.png" width='180px' height='auto' style={{ display: 'block' }} />
            <center>
                <Title level={4} style={{ width: '450px' }}>PUBLIC LOGIN PAGE</Title>
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
}

export default Login;