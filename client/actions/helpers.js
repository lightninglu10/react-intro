/**
* Action helpers
* author: @
*/

// Router requirements
import { browserHistory } from 'react-router';

/* global Promise */

module.exports = {
    /**
    * parses json
    */
    parseJSON: function parseJSON(response) {
        return response.json();
    },

    /**
    * checks status of API call
    */
    checkStatus: function checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response);
        }

        const error = new Error(response.statusText);
        error.response = response;
        return Promise.reject(error);
    },
    /***
    * Handles the general error cases from an API call.
    * 403 pushes to /login
    * 500 pushes to a bad status page
    */
    handleError: function handleError(error) {
        if (error.response.status === 403) {
            browserHistory.push('/login');
        }
    },
};
