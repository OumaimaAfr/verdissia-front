import About from "../components/About.jsx";
import Blog from "../components/Blog.jsx";
import Hero from "../components/Hero.jsx";

function HomePage(){
    return (
        <>
            <Hero />
            <About />
            <Blog />
            <a href="#" className="back-to-top"><i className="lni-chevron-up"></i></a>
        </>
    )
}

export default HomePage