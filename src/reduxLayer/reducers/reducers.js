import { combineReducers } from 'redux';
import * as pubicReducers from './pubicReducers';

export default combineReducers(Object.assign(
  pubicReducers
));
