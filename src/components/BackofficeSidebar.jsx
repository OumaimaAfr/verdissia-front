import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
    BarChartOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    FileSearchOutlined,
    PhoneOutlined,
    CheckSquareOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

function BackofficeSidebar() {
    const { pathname } = useLocation();
    const selectedKeys = [
        pathname === '/backoffice' ? '/backoffice' : pathname
    ];

    return (
        <Sider width={220} style={{ background: '#fff', borderRight:'1px solid #f0f0f0' }}>
            <Menu
                mode="inline"
                selectedKeys={selectedKeys}
                items={[
                    {
                        key: '/backoffice/dashboard',
                        icon: <BarChartOutlined />,
                        label: <Link to="/backoffice/dashboard">Tableau de bord</Link>,
                    },
                    {
                        key: '/backoffice',
                        icon: <CheckCircleOutlined />,
                        label: <Link to="/backoffice">Contrats à créer</Link>,
                    },
                    {
                        key: '/backoffice/blocked',
                        icon: <ExclamationCircleOutlined />,
                        label: <Link to="/backoffice/blocked">Cas bloqués</Link>, // (renommé)
                    },
                    {
                        key: '/backoffice/examiner',
                        icon: <FileSearchOutlined />,
                        label: <Link to="/backoffice/examiner">Cas à examiner</Link>,
                    },
                    {
                        key: '/backoffice/calls',
                        icon: <PhoneOutlined />,
                        label: <Link to="/backoffice/calls">Clients à appeler</Link>,
                    },
                    {
                        key: '/backoffice/declined',
                        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
                        label: <Link to="/backoffice/declined">Cas déclinés</Link>,
                    },
                    {
                        key: '/backoffice/processed',
                        icon: <CheckSquareOutlined style={{ color: '#52c41a' }} />,
                        label: <Link to="/backoffice/processed">Contrats traités</Link>,
                    },
                ]}
            />
        </Sider>
    );
}

export default BackofficeSidebar;
