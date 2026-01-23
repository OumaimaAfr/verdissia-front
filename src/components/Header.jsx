import {Link} from "react-router-dom";

function Header(){
    return (
        <section className="header-area">
            <div className="navbar-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <nav className="navbar navbar-expand-lg">
                                <Link className="navbar-brand" to="/">
                                    <img src="/template-assets/images/logo.png" alt="Logo"/>
                                </Link>

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
        </section>
    )
}

export default Header
