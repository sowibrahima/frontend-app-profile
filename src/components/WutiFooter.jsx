import React from 'react';
import { defineMessages, useIntl } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  copyright: {
    id: 'wuti.footer.copyright',
    defaultMessage: '© {year} WutiSkill Inc. All rights reserved.',
    description: 'WutiSkill footer copyright.',
  },
  footerNav: {
    id: 'wuti.footer.nav',
    defaultMessage: 'Footer',
    description: 'Accessible label for the footer navigation.',
  },
  help: {
    id: 'wuti.footer.help',
    defaultMessage: 'Help center',
    description: 'Footer help link label.',
  },
  terms: {
    id: 'wuti.footer.terms',
    defaultMessage: 'Terms',
    description: 'Footer terms link label.',
  },
  privacy: {
    id: 'wuti.footer.privacy',
    defaultMessage: 'Privacy',
    description: 'Footer privacy link label.',
  },
});

const WutiFooter = () => {
  const intl = useIntl();
  const year = new Date().getFullYear();

  return (
    <footer className="wuti-footer">
      <div className="wuti-footer__inner">
        <p className="wuti-footer__copy">
          {intl.formatMessage(messages.copyright, { year })}
        </p>
        <nav className="wuti-footer__nav" aria-label={intl.formatMessage(messages.footerNav)}>
          <a href="/help" className="wuti-footer__link">
            {intl.formatMessage(messages.help)}
          </a>
          <a href="/terms" className="wuti-footer__link">
            {intl.formatMessage(messages.terms)}
          </a>
          <a href="/privacy" className="wuti-footer__link">
            {intl.formatMessage(messages.privacy)}
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default WutiFooter;
