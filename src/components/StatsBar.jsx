import { Card, Col, Row, Statistic } from 'antd';
import { CheckCircleTwoTone, ExclamationCircleTwoTone, PhoneTwoTone } from '@ant-design/icons';

function StatsBar({ totals }) {
    const { toCreate = 0, toReview = 0, toCall = 0 } = totals || {};
    return (
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} md={8}>
                <Card>
                    <Statistic title="Contrats à créer" value={toCreate} prefix={<CheckCircleTwoTone twoToneColor="#52c41a" />} />
                </Card>
            </Col>
            <Col xs={24} md={8}>
                <Card>
                    <Statistic title="Cas à revoir" value={toReview} prefix={<ExclamationCircleTwoTone twoToneColor="#fa8c16" />} />
                </Card>
            </Col>
            <Col xs={24} md={8}>
                <Card>
                    <Statistic title="Clients à appeler" value={toCall} prefix={<PhoneTwoTone twoToneColor="#722ed1" />} />
                </Card>
            </Col>
        </Row>
    );
}

export default StatsBar;