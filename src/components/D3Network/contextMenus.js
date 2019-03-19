export default function contextMenus(self) {
    return {
        nodes: [
            {
                title: 'Als Baum anordnen',
                action: function (d, i) {
                    self.props.layoutAsTree(d);
                },
                disabled: false // optional, defaults to false
            },
            {
                title: '2-Fach Expandieren',
                action: function (d, i) {
                    self.props.eventListener.nodes.expand(d, 2);
                },
                disabled: false // optional, defaults to false
            },
            {
                title: '3-Fach Expandieren',
                action: function (d, i) {
                    self.props.eventListener.nodes.expand(d, 3);
                },
                disabled: false // optional, defaults to false
            },
            {
                title: 'Kollabieren',
                action: function (d, i) {
                    // build two-sided adjacency
                    const adjacency = [];
                    self.props.links.forEach(link => {
                        if (!adjacency[link.source]) adjacency[link.source] = [];
                        if (!adjacency[link.target]) adjacency[link.target] = [];
                        adjacency[link.source].push(link.target);
                        adjacency[link.target].push(link.source);
                    });

                    // remove neighbors of @d without more neighbours than @d
                    adjacency[d.id].forEach(nodeId => {
                        if (adjacency[nodeId].length <= 1) {
                            self.props.removeNode(nodeId);
                        }
                    });

                },
                disabled: false // optional, defaults to false
            }
        ]
    };
}
