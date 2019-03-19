import { brush } from 'd3-brush';
import { event, zoom } from 'd3';
import { select, selectAll } from 'd3-selection';
import { mouse } from 'd3';

import styles from './styles.module.scss';

export function mouseDownBrush() {
  this.ctrlKey = event.ctrlKey;
  if (!this.ctrlKey) return;

  event.stopImmediatePropagation();
  select(`svg.${styles.network}`).on('.zoom', null);

  if (event.target.tagName == 'svg') {
    if (!event.ctrlKey) {
      selectAll('g.selected').classed('selected', false);
    }

    this.brushTarget = event.target;
    const p = mouse(this.brushTarget);

    this.brushX = p[0];
    this.brushY = p[1];

    this.network
      .select('.gBrush')
      .append('rect')
      .classed(styles.brush, true)
      .attr('x', p[0])
      .attr('y', p[1])
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('width', 0)
      .attr('height', 0);
  }
}

export function mouseUpBrush() {
  select('.gBrush')
    .selectAll('*')
    .remove();
}

export function mouseMoveBrush() {
  if (!this.brushTarget) return;
  this.ctrlKey = event.ctrlKey;

  const p = mouse(this.brushTarget);
  const s = select(`.gBrush rect.${styles.brush}`);
  const self = this;

  if (!s.empty()) {
    const x = Math.min(this.brushX, p[0]);
    const y = Math.min(this.brushY, p[1]);
    const width = Math.abs(this.brushX - p[0]);
    const height = Math.abs(this.brushY - p[1]);

    s.attr('x', x);
    s.attr('y', y);
    s.attr('width', width);
    s.attr('height', height);

    selectAll('.node').each(function(node) {
      node.selected = false;
    });
    selectAll('.node').each(function(node) {
      if (
        !node.selected &&
        self.mapToXScale(node.x) - node.props.__radius >= x &&
        self.mapToXScale(node.x) + node.props.__radius <= x + width &&
        self.mapToYScale(node.y) - node.props.__radius >= y &&
        self.mapToYScale(node.y) + node.props.__radius <= y + height
      ) {
        node.selected = true;
      }
    });
    this.updateSelectedNodes();
  }
}
