import React from 'react';
import PropTypes from 'prop-types';

import styles from './toolboxElement.module.scss';

const ToolboxElement = ({ icon, text, disabled, onClick }) => {
  if (disabled) {
    return (
      <div className={`${styles.item} ${styles.disabled}`}>
        <i className="material-icons">{icon}</i>
        <div>{text}</div>
      </div>
    );
  }

  return (
    <div className={styles.item} onClick={onClick}>
      <i className="material-icons">{icon}</i>
      <div>{text}</div>
    </div>
  );
};

ToolboxElement.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

ToolboxElement.defaultProps = {
  text: '',
  disabled: false,
  onClick: () => {},
};

export default ToolboxElement;
