import React from 'react';
import firebase, { BrandsRef, MachinesRef }  from '../firebase';

export default class Dashboard extends React.Component {
    render() {
        return (
            <div>
                test
            </div>
        );
    }
    
    componentDidMount = () => {
        if (!this.props.isLoggedIn) {
            this.props.history.push('/');
        }
    }

    componentDidUpdate = () => {
        if (!this.props.isLoggedIn) {
            this.props.history.push('/');
        }
    }
}

