import React from 'react';
import firebase  from '../firebase';
import DrawerNavComponent from '../components/drawer/DrawerNavComponent';
import OverviewComponent from '../components/overview/OverviewComponent';
import { Col, Container, Row } from 'reactstrap';
import './Dashboard.css';

export default class Dashboard extends React.Component {
    render() {
        return (
            <div className="wrapper">
                <div className="sidebar">
                    <DrawerNavComponent currentUser={this.props.currentUser} currentBrandName={this.props.currentBrandName}/>
                </div>
                <div className="main">
                    <OverviewComponent/>
                </div>
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

