import About from "../components/About.jsx";
import Hero from "../components/Hero.jsx";

function HomePage(){
    return (
        <>
            <Hero />
            <About />
            <a href="#" className="back-to-top"><i className="lni-chevron-up"></i></a>
        </>
    )
}

export default HomePage