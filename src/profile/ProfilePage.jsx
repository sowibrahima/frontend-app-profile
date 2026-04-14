import React, {
  useEffect, useState, useContext, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { Alert, Hyperlink } from '@openedx/paragon';
import classNames from 'classnames';

import {
  fetchProfile,
  saveProfile,
  saveProfilePhoto,
  deleteProfilePhoto,
  openForm,
  closeForm,
  updateDraft,
} from './data/actions';

import ProfileAvatar from './forms/ProfileAvatar';
import Name from './forms/Name';
import Country from './forms/Country';
import PreferredLanguage from './forms/PreferredLanguage';
import Education from './forms/Education';
import SocialLinks from './forms/SocialLinks';
import Bio from './forms/Bio';
import DateJoined from './DateJoined';
import UserCertificateSummary from './UserCertificateSummary';
import PageLoading from './PageLoading';
import Certificates from './Certificates';

import { profilePageSelector } from './data/selectors';
import messages from './ProfilePage.messages';
import withParams from '../utils/hoc';
import { useIsOnMobileScreen, useIsOnTabletScreen } from './data/hooks';

import AdditionalProfileFieldsSlot from '../plugin-slots/AdditionalProfileFieldsSlot';

ensureConfig(['CREDENTIALS_BASE_URL', 'LMS_BASE_URL', 'ACCOUNT_SETTINGS_URL'], 'ProfilePage');

const ProfilePage = ({ params }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const context = useContext(AppContext);
  const {
    dateJoined,
    courseCertificates,
    name,
    visibilityName,
    profileImage,
    savePhotoState,
    isLoadingProfile,
    photoUploadError,
    country,
    visibilityCountry,
    levelOfEducation,
    visibilityLevelOfEducation,
    socialLinks,
    draftSocialLinksByPlatform,
    visibilitySocialLinks,
    languageProficiencies,
    visibilityLanguageProficiencies,
    bio,
    visibilityBio,
    saveState,
    username,
  } = useSelector(profilePageSelector);

  const navigate = useNavigate();
  const [viewMyRecordsUrl, setViewMyRecordsUrl] = useState(null);
  const isMobileView = useIsOnMobileScreen();
  const isTabletView = useIsOnTabletScreen();
  const authenticatedUserName = context.authenticatedUser.username;
  const isAuthenticatedUserProfile = () => params.username === authenticatedUserName;
  const isBlockVisible = (blockInfo) => isAuthenticatedUserProfile()
      || (!isAuthenticatedUserProfile() && Boolean(blockInfo));
  const certificateCount = courseCertificates?.length || 0;

  useEffect(() => {
    const { CREDENTIALS_BASE_URL } = context.config;
    if (CREDENTIALS_BASE_URL) {
      setViewMyRecordsUrl(`${CREDENTIALS_BASE_URL}/records`);
    }

    dispatch(fetchProfile(params.username));
    sendTrackingLogEvent('edx.profile.viewed', {
      username: params.username,
    });
  }, [dispatch, params.username, context.config]);

  useEffect(() => {
    if (!username && saveState === 'error' && navigate) {
      navigate('/notfound');
    }
  }, [username, saveState, navigate]);

  const handleSaveProfilePhoto = useCallback((formData) => {
    dispatch(saveProfilePhoto(authenticatedUserName, formData));
  }, [dispatch, authenticatedUserName]);

  const handleDeleteProfilePhoto = useCallback(() => {
    dispatch(deleteProfilePhoto(authenticatedUserName));
  }, [dispatch, authenticatedUserName]);

  const handleClose = useCallback((formId) => {
    dispatch(closeForm(formId));
  }, [dispatch]);

  const handleOpen = useCallback((formId) => {
    dispatch(openForm(formId));
  }, [dispatch]);

  const handleSubmit = useCallback((formId) => {
    dispatch(saveProfile(formId, authenticatedUserName));
  }, [dispatch, authenticatedUserName]);

  const handleChange = useCallback((fieldName, value) => {
    dispatch(updateDraft(fieldName, value));
  }, [dispatch]);

  const renderViewMyRecordsButton = () => {
    if (!(viewMyRecordsUrl && isAuthenticatedUserProfile())) {
      return null;
    }

    return (
      <Hyperlink
        className={classNames(
          'profile-page__records-button btn text-nowrap',
          { 'w-100': isMobileView || isTabletView },
        )}
        target="_blank"
        showLaunchIcon={false}
        destination={viewMyRecordsUrl}
      >
        {intl.formatMessage(messages['profile.viewMyRecords'])}
      </Hyperlink>
    );
  };

  const renderPhotoUploadErrorMessage = () => (
    photoUploadError && (
      <div className="row">
        <div className="col-md-4 col-lg-3">
          <Alert variant="danger" dismissible={false} show>
            {photoUploadError.userMessage}
          </Alert>
        </div>
      </div>
    )
  );

  const commonFormProps = {
    openHandler: handleOpen,
    closeHandler: handleClose,
    submitHandler: handleSubmit,
    changeHandler: handleChange,
  };

  return (
    <div className="profile-page">
      {isLoadingProfile ? (
        <PageLoading srMessage={intl.formatMessage(messages['profile.loading'])} />
      ) : (
        <>
          <section className="profile-page__hero">
            <div className="profile-page__hero-shell">
              <div className="profile-page__hero-card profile-page__hero-card--minimal">
                <div className={classNames(
                  'profile-page__hero-main',
                  { 'profile-page__hero-main--stacked': isMobileView || isTabletView },
                )}
                >
                  <div className="profile-page__avatar-column">
                    <ProfileAvatar
                      src={profileImage.src}
                      isDefault={profileImage.isDefault}
                      onSave={handleSaveProfilePhoto}
                      onDelete={handleDeleteProfilePhoto}
                      savePhotoState={savePhotoState}
                      isEditable={isAuthenticatedUserProfile()}
                    />
                  </div>
                  <div className="profile-page__hero-copy">
                    <div className="profile-page__eyebrow">
                      <DateJoined date={dateJoined} />
                    </div>
                    <h1 className="profile-page__display-name">
                      {isBlockVisible(name) && name ? name : params.username}
                    </h1>
                    <p className="profile-page__username">@{params.username}</p>
                    {certificateCount > 0 && (
                      <div className="profile-page__meta-row">
                        <span className="profile-page__meta-pill">
                          <UserCertificateSummary count={certificateCount} />
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="profile-page__hero-utility">
                    {renderViewMyRecordsButton()}
                  </div>
                </div>
                {renderPhotoUploadErrorMessage()}
              </div>
            </div>
          </section>

          <div className="profile-page__content-shell">
            <div className="profile-page__body-grid">
              <aside className="profile-page__rail">
                <section className="profile-page__rail-card profile-page__rail-card--directory">
                  <div className="profile-page__rail-header">
                    <p className="profile-page__section-kicker mb-0">
                      <FormattedMessage
                        id="profile.rail.public.kicker"
                        defaultMessage="Public information"
                        description="Kicker for the public information rail"
                      />
                    </p>
                  </div>
                  <div className="profile-page__rail-directory">
                    {isBlockVisible(name) && (
                      <div className="profile-page__rail-field">
                        <Name
                          name={name}
                          accountSettingsUrl={context.config.ACCOUNT_SETTINGS_URL}
                          visibilityName={visibilityName}
                          formId="name"
                          {...commonFormProps}
                        />
                      </div>
                    )}
                    {isBlockVisible(country) && (
                      <div className="profile-page__rail-field">
                        <Country
                          country={country}
                          visibilityCountry={visibilityCountry}
                          formId="country"
                          {...commonFormProps}
                        />
                      </div>
                    )}
                    {isBlockVisible((languageProficiencies || []).length) && (
                      <div className="profile-page__rail-field">
                        <PreferredLanguage
                          languageProficiencies={languageProficiencies || []}
                          visibilityLanguageProficiencies={visibilityLanguageProficiencies}
                          formId="languageProficiencies"
                          {...commonFormProps}
                        />
                      </div>
                    )}
                    {isBlockVisible(levelOfEducation) && (
                      <div className="profile-page__rail-field">
                        <Education
                          levelOfEducation={levelOfEducation}
                          visibilityLevelOfEducation={visibilityLevelOfEducation}
                          formId="levelOfEducation"
                          {...commonFormProps}
                        />
                      </div>
                    )}
                    {isBlockVisible((socialLinks || []).some((link) => link?.socialLink !== null)) && (
                      <div className="profile-page__rail-field">
                        <p className="profile-page__rail-group-title">
                          <FormattedMessage
                            id="profile.rail.social.title"
                            defaultMessage="Social links"
                            description="Title for social links group in profile rail"
                          />
                        </p>
                        <SocialLinks
                          socialLinks={socialLinks || []}
                          draftSocialLinksByPlatform={draftSocialLinksByPlatform || {}}
                          visibilitySocialLinks={visibilitySocialLinks}
                          formId="socialLinks"
                          {...commonFormProps}
                        />
                      </div>
                    )}
                    <AdditionalProfileFieldsSlot />
                  </div>
                </section>
              </aside>

              <main className="profile-page__main">
                <section className="profile-page__section-card profile-page__section-card--biography">
                  <div className="profile-page__section-header">
                    <div>
                      <p className="profile-page__section-kicker">
                        <FormattedMessage
                          id="profile.section.bio.kicker"
                          defaultMessage="Biography"
                          description="Kicker for biography section"
                        />
                      </p>
                      <h2 className="profile-page__section-title">
                        <FormattedMessage
                          id="profile.section.bio.title"
                          defaultMessage="Your journey"
                          description="Title for biography section"
                        />
                      </h2>
                    </div>
                  </div>
                  <div className="profile-page__feature-card">
                    {isBlockVisible(bio) && (
                      <div className="profile-page__feature-card-body">
                        <Bio
                          bio={bio}
                          visibilityBio={visibilityBio}
                          formId="bio"
                          {...commonFormProps}
                        />
                      </div>
                    )}
                  </div>
                </section>

                {isBlockVisible((courseCertificates || []).length) && (
                  <section className="profile-page__section-card profile-page__section-card--certificates">
                    <div className="profile-page__section-header profile-page__section-header--split">
                      <div>
                        <p className="profile-page__section-kicker">
                          <FormattedMessage
                            id="profile.section.certificates.kicker"
                            defaultMessage="WutiSkill certificates"
                            description="Kicker for the certificates section"
                          />
                        </p>
                        <h2 className="profile-page__section-title">
                          <FormattedMessage
                            id="profile.section.certificates.title"
                            defaultMessage="Awards and credentials"
                            description="Title of the certificates section"
                          />
                        </h2>
                      </div>
                      {isAuthenticatedUserProfile() && renderViewMyRecordsButton()}
                    </div>
                    <Certificates
                      certificates={courseCertificates || []}
                      formId="certificates"
                    />
                  </section>
                )}
              </main>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

ProfilePage.propTypes = {
  params: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
  requiresParentalConsent: PropTypes.bool,
  dateJoined: PropTypes.string,
  username: PropTypes.string,
  bio: PropTypes.string,
  visibilityBio: PropTypes.string,
  courseCertificates: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })),
  country: PropTypes.string,
  visibilityCountry: PropTypes.string,
  levelOfEducation: PropTypes.string,
  visibilityLevelOfEducation: PropTypes.string,
  languageProficiencies: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
  })),
  visibilityLanguageProficiencies: PropTypes.string,
  name: PropTypes.string,
  visibilityName: PropTypes.string,
  socialLinks: PropTypes.arrayOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  draftSocialLinksByPlatform: PropTypes.objectOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  visibilitySocialLinks: PropTypes.string,
  profileImage: PropTypes.shape({
    src: PropTypes.string,
    isDefault: PropTypes.bool,
  }),
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  savePhotoState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  isLoadingProfile: PropTypes.bool,
  photoUploadError: PropTypes.objectOf(PropTypes.string),
};

ProfilePage.defaultProps = {
  saveState: null,
  username: '',
  savePhotoState: null,
  photoUploadError: {},
  profileImage: {},
  name: null,
  levelOfEducation: null,
  country: null,
  socialLinks: [],
  draftSocialLinksByPlatform: {},
  bio: null,
  languageProficiencies: [],
  courseCertificates: [],
  requiresParentalConsent: null,
  dateJoined: null,
  visibilityName: null,
  visibilityCountry: null,
  visibilityLevelOfEducation: null,
  visibilitySocialLinks: null,
  visibilityLanguageProficiencies: null,
  visibilityBio: null,
  isLoadingProfile: false,
};

export default withParams(ProfilePage);
