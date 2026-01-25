import {Routes, Route, Outlet} from 'react-router-dom';
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from "./pages/NotFoundPage.jsx";
import Header from "./components/Header.jsx";
import Formulaire from "./pages/Formulaire/Formulaire.jsx";
import Footer from "./components/Footer.jsx";
import SignaturePage from "./pages/Signature/SignaturePage.jsx";


function RootLayout() {
    return (
        <>
            <Header />
            <main id="main" role="main" tabIndex={-1}>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

function App() {

    return (
       <main id="main" role="main" tabIndex={-1}>
           <Routes>
               <Route element={<RootLayout />}>
                   <Route path="/" element={<HomePage />} />
                   <Route path="/souscription" element={<Formulaire />} />
                   <Route path="/signature" element={<SignaturePage />} />
                   <Route path="*" element={<NotFoundPage />} />
               </Route>
           </Routes>
       </main>
   );
}

export default App
