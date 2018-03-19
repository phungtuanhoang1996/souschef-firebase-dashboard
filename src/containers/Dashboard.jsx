import React from 'react';
import firebase  from '../firebase';
import DrawerNavComponent from '../components/drawer/DrawerNavComponent';
import OverviewComponent from '../containers/Overview/OverviewComponent';
import { Col, Container, Row } from 'reactstrap';
import './Dashboard.css';

export default class Dashboard extends React.Component {
    state = {
        onlineMachines: {},
        offlineMachines: {},
        eventCodes: {},
        selectedEvent: ""
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

    changeSelectedEvent = (event) => {
        this.setState({
            selectedEvent: event
        })
    }

    render() {

        if (this.props.machines != null) {
        }
        return (
            <div className="wrapper">
                <div className="sidebar">
                    <DrawerNavComponent currentUser={this.props.currentUser} currentBrandName={this.props.currentBrandName}/>
                </div>
                <div className="main">
                    <OverviewComponent 
                        onlineMachines={this.state.onlineMachines} 
                        offlineMachines={this.state.offlineMachines}
                        codes={this.state.eventCodes} 
                        selectedEvent={this.state.selectedEvent}
                        changeSelectedEvent={this.changeSelectedEvent}
                        />
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
        if (this.props.brands != null) {
            this.setState({
                eventCodes: this.props.brands[this.props.currentBrandId].events,
                selectedEvent: Object.keys(this.props.brands[this.props.currentBrandId].events)[0]
            })
        }
    }
}

