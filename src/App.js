import React from 'react';

export default class App extends React.Component {
    render(){
        return(
            <Router>
                <Route path="/" component={Home}/>
            </Router>
        );
    }
}