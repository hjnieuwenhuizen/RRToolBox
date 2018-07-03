import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import reducers from './reducers';

const logger = createLogger();
const middleware = applyMiddleware(logger, thunk);
const store = createStore(reducers, composeWithDevTools(middleware));

export default store;
