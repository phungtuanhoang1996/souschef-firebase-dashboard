import React from 'react';
import firebase  from '../firebase';
import DrawerNavComponent from '../components/drawer/DrawerNavComponent';
import OverviewComponent from '../components/overview/OverviewComponent';
import { Col, Container, Row } from 'reactstrap';
import './Dashboard.css';

export default class Dashboard extends React.Component {
    state = {
        onlineMachines: {},
        offlineMachines: {}
    }

    countMachines = () => {
        var onlineMachines = {}
        var offlineMachines = {}
        for (var machine in this.props.machines[this.props.currentBrandName]) {
            if (this.props.machines[this.props.currentBrandName][machine].online) {
                onlineMachines[machine] = this.props.machines[this.props.currentBrandName][machine];
            } else {
                offlineMachines[machine] = this.props.machines[this.props.currentBrandName][machine];
            }
        }
        this.setState({
            onlineMachines: onlineMachines,
            offlineMachines: offlineMachines
        })
    }

    render() {

        if (this.props.machines != null) {
            // console.log(this.props.machines[this.props.currentBrandName]);
        }
        return (
            <div className="wrapper">
                <div className="sidebar">
                    <DrawerNavComponent currentUser={this.props.currentUser} currentBrandName={this.props.currentBrandName}/>
                </div>
                <div className="main">
                    <OverviewComponent onlineMachines={this.state.onlineMachines} offlineMachines={this.state.offlineMachines}/>
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
    
    componentWillReceiveProps(){
        if (this.props.machines != null) {
            this.countMachines();
        }
    }
}

