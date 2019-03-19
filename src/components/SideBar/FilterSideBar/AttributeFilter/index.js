import React, { Component } from 'react';

import { Row, Col, Slider, Form } from 'antd';

import styles from './styles.module.scss';

const FormItem = Form.Item;

const AttributeFilter = ({ attr, type, minVal, maxVal, range, onChange, removeCb }) => {
  const handleChange = (newRange) => {
    onChange(type, attr, newRange);
  };

  const removeFilter = () => {
    removeCb(type, attr);
  };

  return (
    <FormItem label={attr}>
      <Row>
        <Col span={20}>
          <div className={styles.container}>
            <Slider
              // tooltipVisible
              // marks={{ minVal, maxVal }}
              range
              min={minVal}
              max={maxVal}
              defaultValue={[minVal, maxVal]}
              value={range}
              onChange={handleChange}
              step={0.01}
            />
            <span>
              <div className={styles.left}>{Math.round(range[0] * 100) / 100}</div>
              <div className={styles.right}>{Math.round(range[1] * 100) / 100}</div>
            </span>
          </div>
        </Col>
        <Col span={4}>
          <div className={styles.close_button}>
            <i className="material-icons" onClick={removeFilter}>
              delete
            </i>
          </div>
        </Col>
      </Row>
    </FormItem>
  );
};

export default AttributeFilter;
