import styles from './styles.module.scss';
import { drag, event } from 'd3';
import contextMenu from 'd3-context-menu';
import menu from './contextMenus';

/**
 * @param selection - .gNodes
 * @param data - nodes
 * */
export default function enterUpdateExitNodes(selection, data) {
  const self = this;
  const opaqueVal = 0.3;
  let moved = false;
  let prevSelected = false;

  // drag and drop functions
  function dragstarted(d) {
    // select or deselect nodes
    self.ctrlKey = event.sourceEvent.ctrlKey;
    prevSelected = d.selected === true;
    moved = false;
    if (!prevSelected && !self.ctrlKey) self.deselectAll();
    if (!prevSelected) self.onClickNode(d);

    if (!event.active) self.simulation.alphaTarget(0.3).restart();
  }

  function dragged(d) {
    moved = true;

    d.fx = d.fx || d.x;
    d.fy = d.fy || d.y;
    const xDiv = self.mapToXScaleInverted(event.x) - d.fx;
    const yDiv = self.mapToYScaleInverted(event.y) - d.fy;

    // move all selected nodes
    selection.selectAll('.node').each(function (node) {
      if (node.selected) {
        node.fx = node.fx || node.x;
        node.fy = node.fy || node.y;
        node.x = node.fx = node.fx + xDiv;
        node.y = node.fy = node.fy + yDiv;
      }
    });
  }

  function dragended(d) {
    selection.selectAll('.node').each(function (node) {
      if (node.selected && self.props.layouting) {
        node.fx = node.fy = undefined;
      }
    });

    // select or deselect nodes
    if (!self.ctrlKey && !moved) {
      // only deselect nodes if not holding the ctrl key
      self.deselectAll();
    }
    if (!self.ctrlKey && !prevSelected && !moved) self.showClickedNode(d);

    if (!event.active) self.simulation.alphaTarget(0);
  }

  // get all old nodes
  let nodes = selection
    .selectAll('.node')
    .data(data, function (d) {
      return d.id;
    });

  // remove unneeded nodes
  nodes.exit()
    .remove();

  // add new nodes
  let nodeEnter = nodes.enter()
    .append('text')
    .attr('class', `node ${styles.icon}`)
    .text(function (d) {
      return d.icon;
    })
    .call(drag()
      .subject(function (d) {
        return { x: self.mapToXScale(d.x), y: self.mapToYScale(d.y) };
      })
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended))
    .on('contextmenu', contextMenu(menu(this).nodes));

  // merge old and new nodes
  nodes = nodeEnter.merge(nodes);

  function parseName(name, limit = 30){
    if(!name) return '';
    if(name.length < limit) return name;

    return name.substring(0, limit - 3) + '...';
  }

  // for all nodes
  nodes.style('font-size', function (d) {
    // set font size to radius + 10
    return `${parseInt(d.props.__size, 10) + 10}px`;
  })
    .attr('x', '0em')
    .attr('y', function (d) {
      // reposition icon by half of the font size
      return `${(parseInt(d.props.__size, 10) + 10) * 0.5}px`;
    })
    .style('fill', function (d) {
      if (d.invisible) return 'transparent';

      if (d.props.__color) {
        return d.props.__color;
      }

      else return '#000';
    })
    .on('mouseover', function (node) {
        const links = self.network.select('.gLinks').selectAll('path');
        const linkedByIndex = {};
        links.style('stroke', l => {
          linkedByIndex[l.source.id + "," + l.target.id] = 1;
          if (l.invisible) return 'transparent';
          if (node !== l.source && node !== l.target) {
            return self.props.defaultLinkColor;
          }
          if (l.props.__color) return l.props.__color;
          return self.props.defaultLinkColor;
        });
        links.style('stroke-opacity', l => node !== l.source && node !== l.target ? opaqueVal : 1);
        links.style('marker-end', function (e) {
          if (e.invisible || e.props.__undirected) return '';
          if (node !== e.source && node !== e.target) {
            // return '';
            if (e.props.__color) return 'url(#opaque-arrow' + e.props.__color + ')';
            return 'url(#opaque-arrow#BDBDBD)';
          }
          if (e.props.__color) return 'url(#arrow' + e.props.__color + ')';
          return 'url(#arrow#BDBDBD)';
        });

        // check the dictionary to see if nodes are linked
        function isConnected(a, b) {
          return linkedByIndex[a.id + "," + b.id] || linkedByIndex[b.id + "," + a.id] || a.id === b.id;
        }

        const nodes = self.network.select('.gNodes').selectAll('.node');
        nodes.style('opacity', n => isConnected(n, node) ? 1 : opaqueVal);

        const texts = self.network.select('.gTexts').selectAll('.text');
        texts.style('opacity', n => isConnected(n, node) ? 1 : opaqueVal);
        texts.text(function (n) {
          if (n.invisible) return '';
          if(n.id === node.id) return n.props.__label;
          if (!self.showLabels) return '';
          return parseName(n.props.__label);
        });
      }
    )
    .on('mouseout', function (node) {
      const links = self.network.select('.gLinks').selectAll('path');
      links.style('stroke', l => {
        if (l.invisible) return 'transparent';
        if (l.props.__color) return l.props.__color;
        return self.props.defaultLinkColor;
      });
      links.style('stroke-opacity', l => 0.5);
      links.style('marker-end', function (e) {
        if (e.invisible || e.props.__undirected) return '';
        if (e.props.__color) return 'url(#arrow' + e.props.__color + ')';
        return 'url(#arrow#BDBDBD)';
      });
      nodes.style('opacity', 1);

      const texts = self.network.select('.gTexts').selectAll('.text');
      texts.style('opacity', 1);
      texts.text(function (n) {
        if (n.invisible || !self.showLabels) return '';
        return parseName(n.props.__label);
      });
    });

// update all nodes
  for (const key in self.props.eventListener.nodes) {
    if (self.props.eventListener.nodes.hasOwnProperty(key)) {
      nodes.on(key, self.props.eventListener.nodes[key]);
    }
  }
}
