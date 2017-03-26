/**
* React Intro
* This is the entry point component of the app. Its role is limited and it should stay like that.
* author: @
*/

import React from 'react';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Routes from './routes';

class Root extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="startofapp" style={{'height': '100%'}}>
                <Routes history={this.props.history} />
            </div>
        );
    }
}

export default connect()(Root)
