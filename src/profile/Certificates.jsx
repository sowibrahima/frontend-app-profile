import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { connect } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';
import { Hyperlink } from '@openedx/paragon';

import classNames from 'classnames';
import CertificateCard from './CertificateCard';
import { certificatesSelector } from './data/selectors';
import { useIsOnTabletScreen } from './data/hooks';

const Certificates = ({ certificates }) => {
  const isTabletView = useIsOnTabletScreen();
  return (
    <div>
      {certificates?.length > 0 ? (
        <div className="col">
          <div className={classNames(
            'row align-items-center g-3rem',
            { 'justify-content-center': isTabletView },
          )}
          >
            {certificates.map(certificate => (
              <CertificateCard
                key={certificate.courseId}
                certificateType={certificate.certificateType}
                courseDisplayName={certificate.courseDisplayName}
                courseOrganization={certificate.courseOrganization}
                modifiedDate={certificate.modifiedDate}
                downloadUrl={certificate.downloadUrl}
                courseId={certificate.courseId}
                uuid={certificate.uuid}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="pt-2">
          <div className="profile-page__certificate-empty">
            <div className="profile-page__certificate-empty-icon" aria-hidden="true">
              <span className="profile-page__certificate-empty-medal">◌</span>
            </div>
            <h3 className="profile-page__certificate-empty-title">
              <FormattedMessage
                id="profile.no.certificates.title"
                defaultMessage="No certificates earned yet"
                description="Empty state title when user has no certificates"
              />
            </h3>
            <p className="profile-page__certificate-empty-copy">
              <FormattedMessage
                id="profile.no.certificates.description"
                defaultMessage="Your diplomas and completion certificates will appear here automatically when you complete your courses."
                description="Empty state description when user has no certificates"
              />
            </p>
            <Hyperlink
              destination={`${getConfig().LMS_BASE_URL || ''}/dashboard`}
              className="btn btn-primary profile-page__certificate-empty-action"
              showLaunchIcon={false}
            >
              <FormattedMessage
                id="profile.no.certificates.action"
                defaultMessage="Explore the catalog"
                description="CTA for certificate empty state"
              />
            </Hyperlink>
          </div>
        </div>
      )}
    </div>
  );
};

Certificates.propTypes = {
  certificates: PropTypes.arrayOf(PropTypes.shape({
    certificateType: PropTypes.string,
    courseDisplayName: PropTypes.string,
    courseOrganization: PropTypes.string,
    modifiedDate: PropTypes.string,
    downloadUrl: PropTypes.string,
    courseId: PropTypes.string.isRequired,
    uuid: PropTypes.string,
  })),
};

Certificates.defaultProps = {
  certificates: [],
};

export default connect(
  certificatesSelector,
  {},
)(Certificates);
