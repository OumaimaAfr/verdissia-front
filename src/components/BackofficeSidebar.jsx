import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
    BarChartOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    FileSearchOutlined,
    PhoneOutlined,
    FileTextOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

function BackofficeSidebar() {
    const { pathname } = useLocation();
    const selectedKeys = [
        pathname === '/backoffice' ? '/backoffice' : pathname
    ];
    const isDashboard = pathname === '/backoffice/dashboard';
    const headerHeight = isDashboard ? 64 : 56;

    const menuItems = [
        {
            key: '/backoffice/dashboard',
            icon: <BarChartOutlined />,
            label: <Link to="/backoffice/dashboard">Tableau de bord</Link>,
        },
        {
            key: '/backoffice',
            icon: <FileTextOutlined />,
            label: <Link to="/backoffice">Contrats à créer</Link>,
        },
        {
            key: '/backoffice/blocked',
            icon: <ExclamationCircleOutlined />,
            label: <Link to="/backoffice/blocked">Cas bloqués</Link>,
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
            icon: <CloseCircleOutlined />,
            label: <Link to="/backoffice/declined">Cas déclinés</Link>,
        },
        {
            key: '/backoffice/processed',
            icon: <CheckCircleOutlined />,
            label: <Link to="/backoffice/processed">Contrats traités</Link>,
        },
    ];

    const siderStyle = isDashboard ? {
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
        boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: `${headerHeight}px`,
        height: `calc(100vh - ${headerHeight}px)`,
        overflow: 'auto'
    } : {
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
        width: 220,
        position: 'sticky',
        top: `${headerHeight}px`,
        height: `calc(100vh - ${headerHeight}px)`,
        overflow: 'auto'
    };

    const menuIconStyle = (item) => ({
        position: 'relative',
        color: selectedKeys.includes(item.key) ? (isDashboard ? '#10b981' : '#1890ff') : '#6b7280'
    });

    const menuItemStyle = (item) => ({
        margin: '4px 8px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: selectedKeys.includes(item.key) ? (isDashboard ? '#f0fdf4' : '#e6f7ff') : 'transparent',
        color: selectedKeys.includes(item.key) ? (isDashboard ? '#10b981' : '#1890ff') : '#374151',
        fontWeight: selectedKeys.includes(item.key) ? '600' : '400'
    });

    const helpSectionStyle = isDashboard ? {
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        right: '16px',
        padding: '16px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderRadius: '12px',
        color: 'white',
        textAlign: 'center'
    } : null;

    return (
        <Sider 
            width={isDashboard ? 260 : 220} 
            style={siderStyle}
        >
            <Menu
                mode="inline"
                selectedKeys={selectedKeys}
                style={{
                    border: 'none',
                    padding: '8px 0'
                }}
                items={menuItems.map(item => ({
                    key: item.key,
                    icon: (
                        <span style={menuIconStyle(item)}>
                            {item.icon}
                        </span>
                    ),
                    label: item.label,
                    style: menuItemStyle(item)
                }))}
            />

            {isDashboard && (
                <div style={helpSectionStyle}>
                    <div style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '4px'
                    }}>
                        Besoin d'aide ?
                    </div>
                    <div style={{
                        fontSize: '11px',
                        opacity: 0.9,
                        lineHeight: '1.4'
                    }}>
                        Consultez notre documentation ou contactez le support technique
                    </div>
                </div>
            )}
        </Sider>
    );
}

export default BackofficeSidebar;
