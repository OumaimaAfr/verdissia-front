function About(){
    const services = [
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
            ),
            title: "Fourniture d'Énergie Verte",
            description: "Nous proposons des offres d'électricité 100% verte, fiables et adaptées à tous les foyers."
        },
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
            ),
            title: "Installation & Mise en Service",
            description: "Nos équipes vous assistent dans chaque étape pour garantir une mise en service rapide et sans stress."
        },
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
            ),
            title: "Suivi de Consommation Intelligent",
            description: "Grâce à votre espace client, suivez vos dépenses en temps réel et optimisez votre budget."
        },
        {
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
            ),
            title: "Conseils en Optimisation Énergétique",
            description: "Nos experts analysent votre consommation et vous proposent des solutions pour réduire votre facture durablement."
        }
    ];

    return (
        <section className="section-padding" style={{backgroundColor: 'var(--bg-secondary)'}}>
            <div className="container">
                <div className="text-center mb-12 fade-in">
                    <h2 className="mb-4" style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        color: 'var(--text-primary)'
                    }}>
                        Services que Nous Proposons
                    </h2>
                    <p style={{
                        fontSize: '1.125rem',
                        lineHeight: '1.6',
                        color: 'var(--text-secondary)',
                        maxWidth: '700px',
                        margin: '0 auto'
                    }}>
                        Arrêtez de perdre du temps et de l'argent avec des offres d'énergie complexes.
                        Chez VERDISSIA, nous vous accompagnons vers une consommation plus simple, plus verte et plus économique. 
                        Satisfaction garantie!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <div 
                            key={index}
                            className="card fade-in"
                            style={{
                                animationDelay: `${index * 0.1}s`,
                                textAlign: 'center',
                                padding: '2.5rem 1.5rem'
                            }}
                        >
                            <div style={{
                                color: 'var(--primary-color)',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                {service.icon}
                            </div>
                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                marginBottom: '1rem',
                                color: 'var(--text-primary)'
                            }}>
                                {service.title}
                            </h3>
                            <p style={{
                                fontSize: '0.875rem',
                                lineHeight: '1.6',
                                color: 'var(--text-secondary)',
                                margin: 0
                            }}>
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default About
