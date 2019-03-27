import React from 'react';
import { connect } from 'react-redux';

import { Card, Radio, Button, Form } from 'antd';
import FileReaderInput from 'react-file-reader-input';
import { clearGraphMLAction, useGraphMLAction } from 'actions/graphmlActions';
import { useCurvedEdges, useStraightEdges } from 'actions/layoutActions';
import fileDownload from 'js-file-download';

import graphToGraphML from './graphToGraphML';
import styles from './graphSideBar.module.scss';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;

const GraphSideBar = ({ useGraphMLAction, graphml, useCurvedEdges, useStraightEdges, layout }) => {
  const handleGraphmlRead = (e, results) => {
    results.forEach((result) => {
      const [ev] = result;
      useGraphMLAction(ev.srcElement.result);
    });
  };

  const downloadGraphML = () => {
    const data = graphToGraphML();
    fileDownload(data, 'graph.graphml');
  };

  const currentGraphData =
    Object.keys(graphml.nodes).length > 0 ? (
      <div>
        {`Loaded Graph: (${Object.keys(graphml.nodes).length} Vertices, ${
          Object.keys(graphml.links).length
        } Edges)`}
      </div>
    ) : (
      ''
    );

  const handleEdgeStyleChange = (ev) => {
    if (ev.target.value === 'curved') {
      useCurvedEdges();
    } else {
      useStraightEdges();
    }
  };

  return (
    <Card className={`${styles.card}`}>
      <div className={`${styles.card_title}`}>
        <h2>Graph Options</h2>
      </div>
      <Form>
        <FormItem label="Offline GraphML Options">
          <FileReaderInput as="text" onChange={handleGraphmlRead}>
            <Button type="primary" icon="upload" className="full-width">
              Upload GraphML
            </Button>
          </FileReaderInput>

          {currentGraphData}

          <Button type="primary" icon="download" onClick={downloadGraphML} className="full-width">
            Convert current view to graphml
          </Button>
        </FormItem>

        <FormItem label="Node Zoom">
          <RadioGroup defaultValue="geometric" buttonStyle="solid" className="full-width">
            <RadioButton value="geometric">Geometrical Zoom</RadioButton>
            <RadioButton value="optical" disabled>
              Optical Zoom
            </RadioButton>
          </RadioGroup>
        </FormItem>

        <FormItem label="Edge Style">
          <RadioGroup
            defaultValue="curved"
            buttonStyle="solid"
            className="full-width"
            onChange={handleEdgeStyleChange}
            value={layout.useCurvedEdges ? 'curved' : 'straight'}
          >
            <RadioButton value="curved">Curved</RadioButton>
            <RadioButton value="straight">Straight</RadioButton>
          </RadioGroup>
        </FormItem>
      </Form>
    </Card>
  );
};

function mapStateToProps(state) {
  return { graphml: state.graphml, layout: state.layout };
}

export default connect(
  mapStateToProps,
  { useGraphMLAction, clearGraphMLAction, useCurvedEdges, useStraightEdges }
)(GraphSideBar);
