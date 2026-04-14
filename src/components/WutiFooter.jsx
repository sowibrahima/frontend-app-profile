import React from 'react';

const WutiFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="wuti-footer">
      <div className="wuti-footer__inner">
        <p className="wuti-footer__copy">
          © {year} WutiSkill Inc. Tous droits réservés.
        </p>
        <nav className="wuti-footer__nav" aria-label="Footer">
          <a href="/help" className="wuti-footer__link">
            Centre d&apos;aide
          </a>
          <a href="/terms" className="wuti-footer__link">
            Conditions
          </a>
          <a href="/privacy" className="wuti-footer__link">
            Confidentialité
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default WutiFooter;
