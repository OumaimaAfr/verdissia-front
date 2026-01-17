function Header(){
    return (
        <section className="header-area">
            <div className="navbar-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <nav className="navbar navbar-expand-lg">
                                <a className="navbar-brand" href="#">
                                    <img src="/template-assets/images/logo.png" alt="Logo"/>
                                </a>

                                <button className="navbar-toggler" type="button" data-toggle="collapse"
                                        data-target="#navbarEight" aria-controls="navbarEight" aria-expanded="false"
                                        aria-label="Toggle navigation">
                                    <span className="toggler-icon"></span>
                                    <span className="toggler-icon"></span>
                                    <span className="toggler-icon"></span>
                                </button>

                                <div className="collapse navbar-collapse sub-menu-bar" id="navbarEight">
                                    <ul className="navbar-nav ml-auto">
                                        <li className="nav-item active">
                                            <a className="page-scroll" href="#home">HOME</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="page-scroll" href="#about">ABOUT</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="page-scroll" href="#portfolio">PORTFOLIO</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="page-scroll" href="#pricing">PRICING</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="page-scroll" href="#blog">BLOG</a>
                                        </li>
                                    </ul>
                                </div>

                                <div className="navbar-btn d-none mt-15 d-lg-inline-block">
                                    <a className="menu-bar" href="#side-menu-right"><i className="lni-menu"></i></a>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <div id="home" className="header-hero bg_cover" style={{ backgroundImage: 'url(/template-assets/images/header-5.jpg)' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-8 col-lg-10">
                            <div className="header-content text-center">
                                <h3 className="header-title wow fadeInUp" data-wow-duration="1.5s"
                                    data-wow-delay="0.3s">A Multi-purpose Landing Page Designed for Everyone</h3>
                                <p className="text wow fadeInUp" data-wow-duration="1.5s" data-wow-delay="0.8s">Creating
                                    mind-blowing experience for startups</p>
                                <ul className="header-btn rounded-buttons">
                                    <li><a className="main-btn rounded-three wow fadeInUp" data-wow-duration="1.5s"
                                           data-wow-delay="1.1s" href="#">GET IN TOUCH</a></li>
                                    <li><a className="main-btn btn-two video-popup wow fadeInUp"
                                           data-wow-duration="1.5s" data-wow-delay="1.3s"
                                           href="https://youtu.be/T5ZuOXm7voY">WATCH THE VIDEO <i
                                        className="lni-play"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="header-shape">
                    <img src="/template-assets/images/header-shape.svg" alt="shape"/>
                </div>
            </div>
        </section>
    )
}

export default Header
