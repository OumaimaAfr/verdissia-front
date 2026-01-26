import { useContext } from 'react';
import { Layout, Dropdown, Avatar, Space } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';

const { Header } = Layout;

function BackofficeHeader() {
    const { logoutUser } = useContext(AuthContext);

    const items = [
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Se déconnecter',
            onClick: () => {
                logoutUser();
                window.location.href = '/backoffice/login';
            },
        },
    ];

    return (
        <Header className="backoffice-header">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <strong style={{ fontSize: 20 }}>BACK OFFICE</strong>
                <Dropdown menu={{ items }} trigger={['click']}>
                    <Space style={{ cursor:'pointer' }}>
                        <Avatar size="small" icon={<UserOutlined />} />
                    </Space>
                </Dropdown>
            </div>
        </Header>
    );
}

export default BackofficeHeader;
