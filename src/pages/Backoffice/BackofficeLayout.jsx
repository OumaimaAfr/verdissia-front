import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import BackofficeHeader from '../../components/BackofficeHeader.jsx';
import BackofficeSidebar from '../../components/BackofficeSidebar.jsx';

const { Content } = Layout;

function BackofficeLayout() {
    return (
        <Layout className="backoffice-board">
            <BackofficeHeader />
            <Layout>
                <BackofficeSidebar />
                <Content style={{ padding: 16, background: '#fafafa' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default BackofficeLayout;
