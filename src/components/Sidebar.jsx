function Sidebar(){
    return (
        <>
            <div className="sidebar-right">
                <div className="sidebar-close">
                    <a className="close" href="#close"><i className="lni-close"></i></a>
                </div>
                <div className="sidebar-content">
                    <div className="sidebar-logo text-center">
                        <a href="#"><img src="/template-assets/images/logo.png" alt="Logo"/></a>
                    </div>
                    <div className="sidebar-menu">
                        <ul>
                            <li><a href="#">ABOUT</a></li>
                            <li><a href="#">SERVICES</a></li>
                            <li><a href="#">RESOURCES</a></li>
                        </ul>
                    </div>
                    <div className="sidebar-social d-flex align-items-center justify-content-center">
                        <span>FOLLOW US</span>
                        <ul>
                            <li><a href="#"><i className="lni-twitter-original"></i></a></li>
                            <li><a href="#"><i className="lni-facebook-filled"></i></a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="overlay-right"></div>
        </>
    )
}

export default Sidebar
