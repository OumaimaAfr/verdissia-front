import Header from '../components/Header.jsx'
import Sidebar from '../components/Sidebar.jsx'
import About from "../components/About.jsx";
import Portfolio from "../components/Portfolio.jsx";
import Pricing from "../components/Pricing.jsx";
import Blog from "../components/Blog.jsx";
import Footer from "../components/Footer.jsx";

function HomePage(){
    return (
        <>
            <Header />
            <Sidebar />
            <About />
            <Portfolio />
            <Pricing />
            <Blog />
            <Footer />
            <a href="#" className="back-to-top"><i className="lni-chevron-up"></i></a>
        </>
    )
}

export default HomePage