import { Card, Col, Row, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircleTwoTone,
    CloseCircleTwoTone,
    ExclamationCircleTwoTone,
    FileSearchOutlined,
    PhoneTwoTone
} from "@ant-design/icons";

export default function StatsBar({ totals }) {
    const navigate = useNavigate();
    const {
        toCreate = 0,
        toReview = 0,
        toExamine = 0,
        toCall = 0,
        declined = 0,
    } = totals;

    const card = (title, value, icon, route) => (
        <Card hoverable onClick={() => navigate(route)} style={{ cursor: 'pointer' }}>
            <Statistic title={title} value={value} prefix={icon} />
        </Card>
    );

    return (
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                {card("Contrats à créer", toCreate, <CheckCircleTwoTone twoToneColor="#52c41a" />, "/backoffice")}
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                {card("Cas bloqués", toReview, <ExclamationCircleTwoTone twoToneColor="#fa8c16" />, "/backoffice/blocked")}
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                {card("Cas à examiner", toExamine, <FileSearchOutlined style={{ color: '#1677ff' }} />, "/backoffice/examiner")}
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                {card("Clients à appeler", toCall, <PhoneTwoTone twoToneColor="#722ed1" />, "/backoffice/calls")}
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                {card("Cas déclinés", declined, <CloseCircleTwoTone twoToneColor="#ff4d4f" />, "/backoffice/declined")}
            </Col>
        </Row>
    );
}
