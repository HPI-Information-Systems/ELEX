# Entity Landscape Explorer
A graph exploration tool that makes it easier to understand graphs.

## Usage

#### Installation
Use either [yarn](https://yarnpkg.com/lang/en/) or [npm](https://www.npmjs.com/)

Run in Browser:
```bash
npm install
npm run start # starts the dev-server
npm run build
npm run test
npm run lint
```

Run as [Electron](https://electronjs.org/) app  
We use a second package.json for electron so before using electron from the root folder all dependencies for electron has to be installed `cd elecron && npm install `

```bash
npm run electron # starts an electron app that uses the dev-server
npm run build-electron # build an electron app for local os
npm run build-electron-mac # local os has to be an mac os
npm run build-electron-win
npm run build-electron-linux
```

#### View an example graph
To get started open the web application and insert `elex:gen20` into the search bar.
This will load a random graph with `20` nodes into the webapp.
Every other number than `20` is also possible but keep in mind that the number should'nt be too big (>1000) because the graph view is currently build with D3.js and is not suitable for graphs too big.

#### Explore GraphML files
To upload GraphML files you need to click on the graph icon on the top-left corner to open the sidebar related to graphs if not currently open.
Now you can search in the search for your nodes. Keep in mind that a node needs the attribute `name` to be searchable.
With a double click you explore the surrounding area of a node (load in all neighbours).

**GraphML Node/Edge Schema:**  
Every Attribute of a node (or edge) is visible in the sidebar. Exceptions are Attributes beginning with one or two `_`.
The key from attributes with one `_` is visible. If the attribute starts with two `__` the key AND the value are not shown.
Attributes with starting with `__` are used internally in the application to layout the graph and could be overwritten so I advise you from using other than the attributes found in the next section.

Special attribute keys:
- `__cover`: base64 String image that is shown in the sidebar
- `__weight`: determine how big a node relative to all other nodes is. The node weights are mapped to a logarithmic scale and the node with the highest weight is always as big as possible whether the weight is 5 or 5000. Default weight is `20`.
- `__radius`: determine how big a node is. This value is absolute and overwrites the node weight setting. A node with a `__radius` attribute could be bigger or smaller than a node size calculated with given weight.
- `__width`: determine how big an edge is. This value is absolute and overwrites the edge weight setting. An edge with a `__width` attribute could be bigger or smaller than an edge size calculated with given weight. You should use `width` values from `1` to `4` for good clarity
- `__color`: node color in hex representation 

Example:
```
<key id="v_name" for="node" attr.name="name" attr.type="string"/>
<key id="v_color" for="node" attr.name="__color" attr.type="string"/>
<key id="v_type" for="node" attr.name="type" attr.type="string"/>
<graph>
  <node id="n0">
    <data key="v_name">Berlin</data>
    <data key="v_type">Location</data>
    <data key="v_color">#BF5B17</data>
  </node>
</graph>
```

#### Feature List

- Upload GraphML files (not saved - just loaded into the browser)
- Explore the uploaded graph (double click on node)
- View Attributes of Nodes and Edges (by clicking on them)
- Filter Node or Edge Types in and out (by clicking on the legend in the top-right corner)
- Filter Nodes and Edges by their attributes (click on the filter icon in the left toolbar)
- Save the graph as png (camera icon in the toolbar)
- Save currently viewed graph back as GraphML
- Add virtual Nodes and Edges to the graph (via bottom-right menu)

## Future Plans / Features
These features are in no particular order

- [ ] Graphs can downloaded as GraphML files. When the saved graph is uploaded again it is possible to explore the new graph again. The new feature is to save the layout into the GraphML and load the graph with all saved coordinates.
- [ ] Make it possible to switch between geometric and optical zoom.
- [ ] Add an option to switch between curved and straight edges.
- [ ] Edit attributes of nodes and edges while viewing the graph.
- [ ] Add Graph View made with WebGL to support MUCH bigger graphs
- [ ] Add Fish-Eye Graph View (maybe dependent on WebGL feature)
- [ ] Support other graph formats
- [ ] Render Node and Edge Attributes with MarkDown
- [ ] Connect Application to a backend with an endpoint that provides graph data

I'm open for other ideas and feature requests!

## Development & Coding Style:
- [x] We are using Gitflow
- [x] Git version numbers are [Semantic Versioning 2.0.0](https://semver.org/) compliant
- [x] Javascript Codestyle is a mixture of [prettier](https://prettier.io/) and [airbnb](https://github.com/airbnb/javascript/tree/master/react) realized with [ESLint](https://eslint.org/). We are currently reworking every file to adapt to the new coding style.  
`see .eslintrc & .prettierrc`
- [x] This repository uses the [Component-Container](https://redux.js.org/basics/usage-with-react#presentational-and-container-components) convention from redux

## Stack
- [x] [CRA](https://facebook.github.io/create-react-app/)
- [x] [React 16.x](https://facebook.github.io/react/)
- [x] [Redux](http://redux.js.org/)
- [x] [Babel](https://babeljs.io/)
- [x] [Sass](http://sass-lang.com/)
- [x] [D3](https://d3js.org/)
