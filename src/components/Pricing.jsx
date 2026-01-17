function Pricing(){
    return (
        <section id="pricing" className="pricing-area pricing-2">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="section-title text-center pb-20">
                            <h3 className="title">Pricing Plan</h3>
                            <p className="text">Stop wasting time and money designing and managing a website that
                                doesn’t get results. Happiness guaranteed!</p>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-lg-4 col-md-7 col-sm-9">
                        <div className="pricing-style-one mt-40 wow fadeIn" data-wow-duration="1.5s"
                             data-wow-delay="0.2s">
                            <div className="pricing-icon text-center">
                                <img src="/template-assets/images/wman.svg" alt=""/>
                            </div>
                            <div className="pricing-header text-center">
                                <h5 className="sub-title">Basic</h5>
                                <p className="month"><span className="price">$ 199</span>/month</p>
                            </div>
                            <div className="pricing-list">
                                <ul>
                                    <li><i className="lni-check-mark-circle"></i> Carefully crafted components</li>
                                    <li><i className="lni-check-mark-circle"></i> Amazing page examples</li>
                                </ul>
                            </div>
                            <div className="pricing-btn rounded-buttons text-center">
                                <a className="main-btn rounded-three" href="#">GET STARTED</a>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-7 col-sm-9">
                        <div className="pricing-style-one mt-40 wow fadeIn" data-wow-duration="1.5s"
                             data-wow-delay="0.5s">
                            <div className="pricing-icon text-center">
                                <img src="/template-assets/images/wman.svg" alt=""/>
                            </div>
                            <div className="pricing-header text-center">
                                <h5 className="sub-title">Pro</h5>
                                <p className="month"><span className="price">$ 399</span>/month</p>
                            </div>
                            <div className="pricing-list">
                                <ul>
                                    <li><i className="lni-check-mark-circle"></i> Carefully crafted components</li>
                                    <li><i className="lni-check-mark-circle"></i> Amazing page examples</li>
                                </ul>
                            </div>
                            <div className="pricing-btn rounded-buttons text-center">
                                <a className="main-btn rounded-three" href="#">GET STARTED</a>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-7 col-sm-9">
                        <div className="pricing-style-one mt-40 wow fadeIn" data-wow-duration="1.5s"
                             data-wow-delay="0.8s">
                            <div className="pricing-icon text-center">
                                <img src="/template-assets/images/wman.svg" alt=""/>
                            </div>
                            <div className="pricing-header text-center">
                                <h5 className="sub-title">Enterprise</h5>
                                <p className="month"><span className="price">$ 699</span>/month</p>
                            </div>
                            <div className="pricing-list">
                                <ul>
                                    <li><i className="lni-check-mark-circle"></i> Carefully crafted components</li>
                                    <li><i className="lni-check-mark-circle"></i> Amazing page examples</li>
                                </ul>
                            </div>
                            <div className="pricing-btn rounded-buttons text-center">
                                <a className="main-btn rounded-three" href="#">GET STARTED</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Pricing
