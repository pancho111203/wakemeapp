import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import reducers from './redux'
import moment from 'moment';

moment.locale('es');

const store = createStore(
  reducers,
//  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  (<Provider store={store}>
    <App store={store} />
  </Provider>), document.getElementById('root'));
registerServiceWorker();
