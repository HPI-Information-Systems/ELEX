import _ from 'lodash';

/**
 * @param selection - svg
 * @param data - links
 * */
export default function enterUpdateExitArrows(selection, data) {
  let markerColors = _.map(data, function (e) {
    if (e.props.__color) return e.props.__color;
    return '#BDBDBD';
  });
  // markerColors.push('#000');
  markerColors = _.uniq(markerColors);

  const markerObj = [];
  markerColors.forEach(color => {
    markerObj.push({ color: color, opaque: false });
    markerObj.push({ color: color, opaque: true });
  });

  var markers = selection.select('defs').selectAll('marker')
    .data(markerObj);

  markers.exit().remove();

  var markerEnter = markers.enter().append('marker');
  markerEnter
    .attr('id', function (d) {
      return `${d.opaque ? 'opaque-arrow' : 'arrow'}${d.color}`;
    })
    .attr('markerWidth', 10)
    .attr('markerHeight', 10)
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('refX', 3)
    .attr('refY', 5)
    .attr('viewBox', '0 0 10 10')
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M 0 0 L 10 5 L 0 10 z');

  markers = markerEnter.merge(markers);
  markers.style('fill', function (d) {
    return d.color;
  });
  markers.style('opacity', function (d) {
    return d.opaque ? 0.3 : 1;
  });
};
