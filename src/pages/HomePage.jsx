import Sidebar from '../components/Sidebar.jsx'
import About from "../components/About.jsx";
import Portfolio from "../components/Portfolio.jsx";
import Pricing from "../components/Pricing.jsx";
import Blog from "../components/Blog.jsx";
import Hero from "../components/Hero.jsx";

function HomePage(){
    return (
        <>
            <Hero />
            <Sidebar />
            <About />
            <Portfolio />
            <Pricing />
            <Blog />
            <a href="#" className="back-to-top"><i className="lni-chevron-up"></i></a>
        </>
    )
}

export default HomePage