import axios from "axios";
import { API_FETCH_DETAILS, API_FETCH_GRAPH, API_FETCH_META, API_FETCH_SUGGESTIONS } from "../types";
import https from "https";
import connection from "./connection";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


const axios_instance = function() {
    const params = {
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        })
    };
    // check if we really need to set the header/auth
    if (connection.auth) {
        params.headers = {
            "Authorization": connection.auth
            //, 'Access-Control-Allow-Origin': '*'
        };
    }
    return axios.create(params);
}();

// axios_instance.defaults.headers.common['Authorization'] = 'Basic dGVzdEBtYWlsLm1lOmNiaw==';

function getAPI() {
    if (connection) return connection.api;
    return "/api";
}

export default {
    fetchMeta: (dispatch) => {
        const request = `${getAPI()}/meta`;
        console.log(`request: ${request}`);
        axios_instance.get(request)
          .then(response => {
              console.log(response.data);
              dispatch({
                  type: API_FETCH_META,
                  payload: response.data
              });
          })
          .catch((error) => {
              console.log(error);
          });
    },

    sendFeedback(dispatch, props) {
        const request = `${getAPI()}/feedback`;
        console.log(`request: ${request}`);
        console.log('push feedback:', props);

        axios_instance
          .post(request, props)
          .then(function(response) {
              dispatch({
                  type: "",
                  payload: {}
              });
          })
          .catch((error) => {
              console.log(error);
          });
    },

    fetchDetails: (dispatch, id, type) => {
        const request = `${getAPI()}/${type}/_id/${id}/_details`;
        console.log(`request: ${request}`);

        axios_instance.get(request)
          .then(response => {
              dispatch({
                  type: API_FETCH_DETAILS,
                  payload: { page: response.data, id, type }
              });
          })
          .catch((error) => {
              console.log(error);
          });
    },

    fireCypherRequest:
      (dispatch, cypherQuery) => {
          const request = `${getAPI()}/query/${cypherQuery}`;
          console.log(`request: ${request}`);
          axios_instance.get(request)
            .then(response => {
                dispatch({
                    type: API_FETCH_GRAPH,
                    payload: response.data
                });
            })
            .catch((error) => {
                console.log(error);
            });
      },

    getNNodes:
      (dispatch, count) => {
          console.log(`request for n:(${count}) random nodes is currently unsupported`);
          console.log("graph is cleared");
          setTimeout(function() {
              dispatch({
                  type: API_FETCH_GRAPH,
                  payload: { nodes: [], links: [] }
              });
          }, 100);
      },

    fetchSuggestions:
      (dispatch, state, search) => {
          if (search.startsWith("cle:gen")) {
              const suggestions = [{
                  name: `Generate ${search.substring(7)} nodes`,
                  id: -1,
                  type: "gen",
                  query: search,
                  searchKey: search
              }];
              suggestions.searchKey = search;
              dispatch({
                  type: API_FETCH_SUGGESTIONS,
                  payload: suggestions
              });
              return;
          }

          // cypher query
          if (search.startsWith("cle:")) {
              dispatch({
                  type: API_FETCH_SUGGESTIONS,
                  payload: [{
                      type: "Cypher",
                      name: "Execute Query",
                      id: -1,
                      query: search.substring(4),
                      searchKey: search
                  }]
              });
              return;
          }

          // cleL query
          if (search.includes("->")) {
              dispatch({
                  type: API_FETCH_SUGGESTIONS,
                  payload: [{ type: "DSL", name: "Execute DSL", id: -1, query: search, searchKey: search }]
              });
              return;
          }

          let params = "?";
          if (state.api.requestParams.nodeTypes.length > 0) {
              const nodeParam = state.api.requestParams.nodeTypes.join("%7C");
              params += `nodeTypes=${nodeParam}`;
          }
          const request = `${getAPI()}/node/_suggest/${search}${params}`;
          console.log(`request: ${request}`);
          axios_instance
            .get(request)
            .then(function(response) {
                const data = response.data;
                data.searchKey = response.request.responseURL.substring(response.request.responseURL.indexOf("api/node/_suggest/") + 18);
                data.searchKey = data.searchKey.split("%20").join(" ");
                dispatch({
                    type: API_FETCH_SUGGESTIONS,
                    payload: data
                });
            })
            .catch((error) => {
                console.log(error);
            });
      },

    fetchNeighbours(dispatch, state, id, depth) {
        let params = "?";

        // add neighbor depth
        params += `depth=${depth}`;

        if (state.api.requestParams.nodeTypes.length > 0) {
            const nodeParam = state.api.requestParams.nodeTypes.join("%7C");
            params += `&nodeTypes=${nodeParam}`;
        }
        if (state.api.requestParams.linkTypes.length > 0) {
            const linkParam = state.api.requestParams.linkTypes.join("%7C");
            params += `&linkTypes=${linkParam}`;
        }

        const request = `${getAPI()}/node/_id/${id}/_neighbors${params}`;
        console.log(`request: ${request}`);
        axios_instance.get(request)
          .then(response => {
              // set id that is used for fetching the neighbours
              response.data.searchId = id;
              dispatch({
                  type: API_FETCH_GRAPH,

                  payload: response.data
              });
          })
          .catch((error) => {
              console.log(error);
          });
    }
};
