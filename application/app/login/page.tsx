'use client'
import { Row, Col } from 'antd';
import AuthPage from '../components/authPage';

const LoginPage = () => {
    return (
        <Row>
            <Col span={12} offset={6}>
                <AuthPage />
            </Col>
        </Row>
    )
}

export default LoginPage