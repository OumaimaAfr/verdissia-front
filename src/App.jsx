import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from "./pages/NotFoundPage.jsx";
import Header from "./components/Header.jsx";
import Formulaire from "./pages/Formulaire/Formulaire.jsx";
import Footer from "./components/Footer.jsx";
import SignaturePage from "./pages/Signature/SignaturePage.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import BackofficeLayout from "./pages/Backoffice/BackofficeLayout.jsx";
import ContratsPage from "./pages/Backoffice/ContratsPage.jsx";
import ClientsCallPage from "./pages/Backoffice/ClientsCallPage.jsx";
import BlockedPage from "./pages/Backoffice/BlockedPage.jsx";
import DeclinedPage from "./pages/Backoffice/DeclinedPage.jsx";
import ExaminerPage from "./pages/Backoffice/ExaminerPage.jsx";
import DashboardPage from "./pages/Backoffice/DashboardPage.jsx";
import ProcessedContractsPage from "./pages/Backoffice/ProcessedContractsPage.jsx";
import CreatePage from "./pages/Backoffice/CreatePage.jsx";

function RootLayout() {
    const { pathname } = useLocation();
    const isBackoffice = pathname.startsWith('/backoffice');
    const isBackofficeLogin = pathname === '/backoffice/login';

    return (
        <>
            {!isBackoffice && <Header />}
            <main id="main" role="main" tabIndex={-1}>
                <Outlet />
            </main>
            {(!isBackoffice || isBackofficeLogin) && <Footer />}
        </>
    );
}

function App() {
    return (
        <Routes>
            <Route element={<RootLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/souscription" element={<Formulaire />} />
                <Route path="/signature" element={<SignaturePage />} />
                <Route path="/backoffice/login" element={<LoginPage />} />

                <Route
                    path="/backoffice"
                    element={
                        <ProtectedRoute>
                            <BackofficeLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<ContratsPage />} />
                    <Route path="/backoffice/dashboard" element={<DashboardPage />} />
                    <Route path="/backoffice/create" element={<CreatePage />} />
                    <Route path="/backoffice/blocked" element={<BlockedPage />} />
                    <Route path="/backoffice/examiner" element={<ExaminerPage />} />
                    <Route path="calls" element={<ClientsCallPage />} />
                    <Route path="/backoffice/declined" element={<DeclinedPage />} />
                    <Route path="/backoffice/processed" element={<ProcessedContractsPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}

export default App;
