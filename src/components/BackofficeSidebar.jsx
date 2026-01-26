import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircleOutlined, ExclamationCircleOutlined, PhoneOutlined } from '@ant-design/icons';

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
                        key: '/backoffice',
                        icon: <CheckCircleOutlined />,
                        label: <Link to="/backoffice">Contrats à créer</Link>,
                    },
                    {
                        key: '/backoffice/review',
                        icon: <ExclamationCircleOutlined />,
                        label: <Link to="/backoffice/review">Cas à revoir</Link>,
                    },
                    {
                        key: '/backoffice/calls',
                        icon: <PhoneOutlined />,
                        label: <Link to="/backoffice/calls">Clients à appeler</Link>,
                    },
                ]}
            />
        </Sider>
    );
}

export default BackofficeSidebar;
