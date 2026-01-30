import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from "./pages/NotFoundPage.jsx";
import Header from "./components/Header.jsx";
import Formulaire from "./pages/Formulaire/Formulaire.jsx";
import Footer from "./components/Footer.jsx";
import SignaturePage from "./pages/Signature/SignaturePage.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import BackofficeLayout from "./pages/BackofficeLayout.jsx";
import ContratsPage from "./pages/ContratsPage.jsx";
import ClientsCallPage from "./pages/ClientsCallPage.jsx";
import BlockedPage from "./pages/BlockedPage";
import DeclinedPage from "./pages/DeclinedPage";
import ExaminerPage from "./pages/ExaminerPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

function RootLayout() {
    const { pathname } = useLocation();
    const isBackoffice = pathname.startsWith('/backoffice');

    return (
        <>
            {!isBackoffice && <Header />}
            <main id="main" role="main" tabIndex={-1}>
                <Outlet />
            </main>
            <Footer />
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
                    <Route path="/backoffice/blocked" element={<BlockedPage />} />
                    <Route path="/backoffice/examiner" element={<ExaminerPage />} />
                    <Route path="calls" element={<ClientsCallPage />} />
                    <Route path="/backoffice/declined" element={<DeclinedPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}

export default App;
