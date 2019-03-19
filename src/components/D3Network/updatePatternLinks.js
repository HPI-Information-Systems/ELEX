import styles from './styles.module.scss';

/**
 * @param selection - .gLinks
 * @param data - links
 * */
export default function enterUpdateExitLinks(selection, data) {
  const self = this;

  let links = selection
    .selectAll('path')
    .data(data, function (d) {
      return d.source.id + '-' + d.target.id;
    });

  links.exit()
    .remove();

  let linkEnter = links.enter()
    .append('path')
    .attr('class', `link ${styles.link}`)
    .style('stroke-width', function (e) {
      if (e.props.__size) return e.props.__size;
      return 2;
    });

  links = linkEnter.merge(links)
    .style('stroke', function (e) {
      if (e.invisible) return 'transparent';

      if (e.props.__color) return e.props.__color;
      return self.props.defaultLinkColor;
    })
    .style('marker-end', function (e) {
      if (e.invisible || e.props.__undirected) return '';

      if (e.props.__color) return 'url(#arrow' + e.props.__color + ')';
      return 'url(#arrow#BDBDBD)';
    });
  links.on('mousedown', self.props.eventListener.links['click']);
};
