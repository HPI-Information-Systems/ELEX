import styles from './styles.scss';
import { event, drag } from 'd3';

export default function nodeUpdatePattern(selection, data, D3Network) {
  function dragstarted(d) {
    if (!event.active) D3Network.simulation.alphaTarget(0.3).restart();
    d.x = event.x;
    d.y = event.y;
  }

  function dragged(d) {
    d.x = d.fx = event.x;
    d.y = d.fy = event.y;
  }

  function dragended(d) {
    if (!event.active) D3Network.simulation.alphaTarget(0);
    d.fixed = true;
  }

  let nodes = selection
    .selectAll('circle')
    .data(data, function (d) {
      return d.id + d.type;
    });

  nodes.exit().remove();

  // update new nodes
  let nodeEnter = nodes.enter().append('circle');
  nodeEnter
    .attr('class', `node ${styles.node}`)
    .style('fill', function (d) {
      // if (useIcon) {
      //   return 'transparent';
      // }

      if (d.color) {
        return d.color;
      }

      return D3Network.props.defaultNodeColor;
    })
    .call(drag()
    // .subject(function (d) {
    //   return { x: controls.currentXScale(d.x), y: controls.currentYScale(d.y) };
    // })
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  nodes = nodeEnter.merge(nodes);
  // update all nodes
  nodes.attr('r', function (n) {
    // if (useIconValue(n)) return n.radius;
    return n.radius - 3;
  });
};
