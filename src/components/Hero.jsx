import {Link} from "react-router-dom";

function Hero(){
    return (
        <div id="home" className="header-hero bg_cover" style={{ backgroundImage: 'url(/assets/images/header-1.png)' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-8 col-lg-10">
                        <div className="header-content text-center">
                            <h3 className="header-title wow fadeInUp" data-wow-duration="1.5s"
                                data-wow-delay="0.3s">Souscrivez en ligne en quelques minutes, sans engagement</h3>
                            <p className="text wow fadeInUp" data-wow-duration="1.5s" data-wow-delay="0.8s">Choisissez une offre d’énergie adaptée à vos besoins, maîtrisez votre consommation
                                et profitez d’un accompagnement fiable au quotidien</p>
                            <ul className="header-btn rounded-buttons">
                                <li>
                                    <Link to="/souscription" className="main-btn rounded-three wow fadeInUp" data-wow-duration="1.5s" data-wow-delay="1.1s">
                                        Lancer ma souscription
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="header-shape">
                <img src="/assets/images/header-shape.svg" alt="shape"/>
            </div>
        </div>
    )
}

export default Hero;
