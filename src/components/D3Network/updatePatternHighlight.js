import styles from './styles.module.scss';
import { hsl } from 'd3';

/**
 * @param selection - .gHighlights
 * @param data - nodes
 * */
export default function enterUpdateExitHighlight(selection, data) {
  const self = this;

  // get all old nodes
  let highlights = selection
    .selectAll('.highlight')
    .data(
      data.filter(function (d) {
        return d.selected === true;
      }), function (d) {
        // ids of nodes
        return d.id;
      }
    );

  // remove unneeded nodes
  highlights.exit()
    .remove();

  // add new nodes
  let highlightEnter = highlights.enter()
    .append('circle')
    .attr('class', `highlight ${styles.highlight}`)
    .attr('r', function (d) {
      return d.props.__size;
    })
    .style('stroke', function (d) {
      var hslColor;
      var color = '#000';
      if (d.props.__color) color = d.props.__color;

      hslColor = hsl(color);
      // make the highlight brighter (or darker if the color can't get brighter)
      if (hslColor.l + 0.15 > 0.8) hslColor.l -= 0.15;
      else hslColor.l += 0.15;
      return hslColor;
    })
    .style('stroke-dasharray', '0px')
    .style('stroke-opacity', 0.8);

  // merge old and new nodes
  highlights = highlightEnter.merge(highlights);
}
