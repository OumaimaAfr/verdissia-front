import { Link, NavLink } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useLocation } from "react-router-dom";

function Header() {
    const { pathname, hash } = useLocation();

    const isHome = pathname === "/";
    const liAccueilActive = isHome && (hash === "" || hash === "#");
    const liSouscriptionActive = pathname === "/souscription";
    const liAboutActive = isHome && hash === "#about";
    const liBlogActive = isHome && hash === "#blog";

    const scrollWithOffset = (el) => {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
    };

    return (
        <section className="header-area">
            <div className="navbar-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <nav className="navbar navbar-expand-lg">
                                <Link className="navbar-brand" to="/">
                                    <img src="/assets/images/logo-new.png" alt="Logo" />
                                </Link>

                                <button
                                    className="navbar-toggler"
                                    type="button"
                                    data-toggle="collapse"
                                    data-target="#navbarEight"
                                    aria-controls="navbarEight"
                                    aria-expanded="false"
                                    aria-label="Toggle navigation"
                                >
                                    <span className="toggler-icon"></span>
                                    <span className="toggler-icon"></span>
                                    <span className="toggler-icon"></span>
                                </button>

                                <div className="collapse navbar-collapse sub-menu-bar" id="navbarEight">
                                    <ul className="navbar-nav ml-auto">
                                        <li className={`nav-item ${liAccueilActive ? "active" : ""}`}>
                                            <NavLink to="/" end className="page-scroll">Accueil</NavLink>
                                        </li>

                                        <li className={`nav-item ${liSouscriptionActive ? "active" : ""}`}>
                                            <NavLink to="/souscription" className="page-scroll">Souscription</NavLink>
                                        </li>

                                        <li className={`nav-item ${liAboutActive ? "active" : ""}`}>
                                            <HashLink
                                                smooth
                                                scroll={scrollWithOffset}
                                                to="/#about"
                                                className="page-scroll"
                                            >
                                                Qui sommes-nous ?
                                            </HashLink>
                                        </li>

                                        <li className={`nav-item ${liBlogActive ? "active" : ""}`}>
                                            <HashLink
                                                smooth
                                                scroll={scrollWithOffset}
                                                to="/#blog"
                                                className="page-scroll"
                                            >
                                                Articles
                                            </HashLink>
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Header;
