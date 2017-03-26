/**
* Login Actions
* auth actions
* author: @
*/

import types from '../config/action-types';
import API from '../config/api';
import Helpers from './helpers';

// action functions
function loginSuccessful(username) {
    return {
        type: types.LOGIN_SUCCESSFUL,
        username: username,
    }
}

// These are all of the functions that you can utilize
module.exports = {
    login: function login() {
        // Dispatch tells Redux to send to store
        return dispatch => {
            return fetch(API.LOGIN, API.POST_CONFIG)
            .then(Helpers.checkStatus)
            .then(Helpers.parseJSON)
            .then((json) => {
                return dispatch(loginSuccessful(json.username));
            });
        }
    }
}