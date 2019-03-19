import React from 'react';
import PropTypes from 'prop-types';

import { Icon, Tooltip } from 'antd';
import styles from './styles.module.scss';

const ToolIcon = ({ active, icon, tooltip, rolling, onClick, disabled }) => {
  let className = `${styles.icon} `;
  if (active) {
    className += `${styles.active} `;
    if (rolling) {
      className += `${styles.rolling} `;
    }
  }

  if (disabled) {
    return (
      <div className={`${styles.icon} ${styles.disabled}`}>
        <Tooltip placement="left" title={tooltip}>
          <Icon type={icon} />
        </Tooltip>
      </div>
    );
  }

  return (
    <div className={className}>
      <Tooltip placement="left" title={tooltip}>
        <Icon type={icon} onClick={onClick} />
      </Tooltip>
    </div>
  );
};

ToolIcon.propTypes = {
  active: PropTypes.bool.isRequired,
  icon: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  rolling: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

ToolIcon.defaultProps = {
  rolling: false,
  tooltip: '',
  disabled: false,
};

export default ToolIcon;
