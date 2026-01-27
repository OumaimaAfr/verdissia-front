import { Card, Col, Row, Statistic } from 'antd';
import {
    CheckCircleTwoTone,
    ExclamationCircleTwoTone,
    PhoneTwoTone,
    CloseCircleTwoTone,
    FileSearchOutlined
} from '@ant-design/icons';

export default function StatsBar({ totals }) {
    const {
        toCreate = 0,
        toReview = 0,   // Cas bloqués
        toExamine = 0,  // Cas à examiner
        toCall = 0,     // Clients à appeler
        declined = 0,   // Cas déclinés
    } = totals || {};

    return (
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <Card>
                    <Statistic
                        title="Contrats à créer"
                        value={toCreate}
                        prefix={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <Card>
                    <Statistic
                        title="Cas bloqués"
                        value={toReview}
                        prefix={<ExclamationCircleTwoTone twoToneColor="#fa8c16" />}
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <Card>
                    <Statistic
                        title="Cas à examiner"
                        value={toExamine}
                        prefix={<FileSearchOutlined style={{ color: '#1677ff' }} />}
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <Card>
                    <Statistic
                        title="Clients à appeler"
                        value={toCall}
                        prefix={<PhoneTwoTone twoToneColor="#722ed1" />}
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <Card>
                    <Statistic
                        title="Cas déclinés"
                        value={declined}
                        prefix={<CloseCircleTwoTone twoToneColor="#ff4d4f" />}
                    />
                </Card>
            </Col>
        </Row>
    );
}
