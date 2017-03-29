/**
* user reducer
* author: @patr
*/

import types from '../config/action-types';

const initialState = {
    isLoggedIn: false,
    isFacebookFetching: false,
    email: '',
}

module.exports = function userReducer(state = initialState, action) {
    switch(action.type) {
        case types.LOGIN_SUCCESSFUL:
        return {
            ...state,
            ...action,
        }

        default:
        return state;
    }
}
