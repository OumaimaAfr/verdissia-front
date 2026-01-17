import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx'

function App() {
   return (
       <main id="main" role="main" tabIndex={-1}>
           <Routes>
               <Route path="" element={<HomePage />} />
           </Routes>
       </main>
   );
}

export default App
