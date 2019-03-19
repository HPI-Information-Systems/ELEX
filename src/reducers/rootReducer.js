import { combineReducers } from 'redux';
import ApiReducer from './apiReducer';
import SidebarReducer from './sidebarReducer';
import ConfigReducer from './configReducer';
import FilterReducer from './filterReducer';
import GraphMLReducer from './graphmlReducer';
import SuggestionReducer from './suggestionReducer';
import EventReducer from './eventReducer';
import LayoutReducer from './layoutReducer';

const rootReducer = combineReducers({
  api: ApiReducer,
  config: ConfigReducer,
  sidebar: SidebarReducer,
  filter: FilterReducer,
  graphml: GraphMLReducer,
  suggestions: SuggestionReducer,
  events: EventReducer,
  layout: LayoutReducer,
});

export default rootReducer;
