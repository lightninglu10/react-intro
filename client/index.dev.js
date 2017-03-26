import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './config/configure-store-dev';
import Root from './containers/root';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
    <Provider store={store}>
        <Root className="startofapp" history={history} />
    </Provider>
    , document.getElementById('app')
);

if (module.hot) {
    module.hot.accept('./containers/root', () => {
        const NextRoot = require('./containers/root').default;
        ReactDOM.render(
            <Provider store={store}>
                <NextRoot className="startofapp" history={history} />
            </Provider>,
            document.getElementById('app')
        );
    });
}
