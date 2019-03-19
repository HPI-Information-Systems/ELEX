import React from 'react';
import PropTypes from 'prop-types';

import styles from './infoCard.module.scss';

const InfoCard = ({ obj }) => {
  const replaceURLWithHTMLLinks = (text) => {
    if (typeof text === 'string' || text instanceof String) {
      const exp = /((https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
      return text.replace(exp, '<a target="_blank" href=\'$1\'>$1</a>');
    }
    return text;
  };

  const AttributeView = ({ attributeKey, value }) => {
    if (attributeKey === 'name' || attributeKey.startsWith('__')) return '';

    const parsedValue = (
      <span dangerouslySetInnerHTML={{ __html: replaceURLWithHTMLLinks(value) }} />
    );

    // don't show key, but show the attribute
    if (attributeKey.startsWith('_')) {
      return (
        <p key={attributeKey} className={styles.facts}>
          {parsedValue}
        </p>
      );
    }

    return (
      <p key={attributeKey} className={styles.facts}>
        <em>{`${attributeKey}: `}</em>
        {parsedValue}
      </p>
    );
  };

  AttributeView.propTypes = {
    attributeKey: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  };

  console.log(obj.props);

  return (
    <div>
      <h3 className={styles.subHeader}>Attributes</h3>
      {Object.keys(obj.props).map((key) => (
        <AttributeView attributeKey={key} value={obj.props[key]} />
      ))}
    </div>
  );
};

InfoCard.propTypes = { obj: PropTypes.shape({}).isRequired };

export default InfoCard;
