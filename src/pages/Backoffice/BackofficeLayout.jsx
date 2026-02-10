import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import BackofficeHeader from '../../components/BackofficeHeader.jsx';
import BackofficeSidebar from '../../components/BackofficeSidebar.jsx';

const { Content } = Layout;

function BackofficeLayout() {
    const { pathname } = useLocation();
    const isDashboard = pathname === '/backoffice/dashboard';
    const headerHeight = isDashboard ? 64 : 56;

    const layoutStyle = isDashboard ? {
        minHeight: '100vh',
        background: '#f8fafc'
    } : {
        minHeight: '100vh',
        background: '#ffffff'
    };

    const contentStyle = isDashboard ? {
        padding: '24px',
        background: '#f8fafc',
        minHeight: `calc(100vh - ${headerHeight}px)`,
        overflow: 'auto'
    } : {
        padding: '16px',
        background: '#ffffff',
        minHeight: `calc(100vh - ${headerHeight}px)`,
        overflow: 'auto'
    };

    return (
        <Layout className="backoffice-board" style={layoutStyle}>
            <BackofficeHeader />
            <Layout>
                <BackofficeSidebar />
                <Content style={contentStyle}>
                    <div style={{
                        maxWidth: isDashboard ? '1400px' : '100%',
                        margin: '0 auto',
                        width: '100%'
                    }}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

export default BackofficeLayout;
