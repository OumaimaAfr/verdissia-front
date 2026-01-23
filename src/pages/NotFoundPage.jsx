import { Link, useLocation } from 'react-router-dom';

function NotFoundPage() {
    const location = useLocation();

    return (
        <section className="not-found">
            <h1>404</h1>
            <p>Page introuvable</p>

            <p>
                Désolé, la page <code className="nf-code">{location.pathname}</code> n’existe pas ou a été déplacée.
            </p>
        </section>
    );
}

export default NotFoundPage
