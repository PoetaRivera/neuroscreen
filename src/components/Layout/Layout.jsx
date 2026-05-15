import { Outlet, NavLink, useLocation } from 'react-router-dom';
import './Layout.css';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/perfil', label: 'Mi perfil' },
  { to: '/historias', label: 'Historias' },
  { to: '/recursos', label: 'Recursos' },
];

function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="app-layout">
      <header className="app-header">
        <NavLink to="/" className="app-logo" aria-label="EvaluMind — Ir al inicio">
          EvaluMind
        </NavLink>
        <nav className="app-nav" role="navigation" aria-label="Navegación principal">
          {NAV_LINKS.filter((l) => l.to !== '/').map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `app-nav-link${isActive ? ' app-nav-link--active' : ''}`}
              end
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className={`app-main${isHome ? ' app-main--home' : ''}`}>
        <Outlet />
      </main>

      <footer className="app-footer">
        <div className="app-footer-content">
          <div className="app-footer-brand">
            <span className="app-footer-name">EvaluMind</span>
            <span className="app-footer-tagline">Herramienta de orientación cognitiva</span>
          </div>
          <nav className="app-footer-nav">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className="app-footer-link" end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <p className="app-footer-disclaimer">
            EvaluMind no diagnostica. Solo ofrece información orientativa basada en criterios científicos.
            Consulta siempre con un profesional de la salud.
          </p>
          <p className="app-footer-privacy">
            No pedimos datos personales. El perfil local vive en tu sesión; las respuestas pueden enviarse de forma anónima para análisis agregado.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
