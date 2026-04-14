import React from 'react';
import PropTypes from 'prop-types';

const SwitchContent = ({ expression = null, cases, className = null }) => {
  const getContent = (caseKey) => {
    if (cases[caseKey]) {
      if (typeof cases[caseKey] === 'string') {
        return getContent(cases[caseKey]);
      }
      return React.cloneElement(cases[caseKey], { key: caseKey });
    }
    if (cases.default) {
      if (typeof cases.default === 'string') {
        return getContent(cases.default);
      }
      React.cloneElement(cases.default, { key: 'default' });
    }

    return null;
  };

  return (
    <div className={className}>
      {getContent(expression)}
    </div>
  );
};

SwitchContent.propTypes = {
  expression: PropTypes.string,
  cases: PropTypes.objectOf(PropTypes.node).isRequired,
  className: PropTypes.string,
};

export default SwitchContent;
