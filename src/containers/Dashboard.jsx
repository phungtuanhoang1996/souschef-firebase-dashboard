import React from 'react';
import DrawerNavComponent from '../components/drawer/DrawerNavComponent';
import OverviewComponent from '../containers/Overview/OverviewComponent';
import {bindActionCreators} from "redux";
import * as actionCreators from "../actions/actionCreators";
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import QrCodesComponent from "./Overview/QrCodesComponent";

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedItem: 'overview'
        }
    }

    componentToDisplay = (selectedItem) => {
        switch (selectedItem) {
            case 'overview': return (<OverviewComponent/>)
            case 'machines': return null
            case 'codes': return (<QrCodesComponent/>)
        }
    }

    onItemSelect = (selectedItem) => {
        this.setState({
            selectedItem: selectedItem
        })
    }

    render() {
        return (
            <div className="wrapper" style={{backgroundColor: '#EAEEF2', display: 'flex', width: '100%', height: '100%'}}>
                    <DrawerNavComponent
                        currentUser={this.props.currentUser}
                        currentBrandName={this.props.currentBrandName}
                        currentEvent={this.props.currentEvent}
                        onItemSelect={this.onItemSelect}
                        selectedItem={this.state.selectedItem}
                        events={Object.keys(this.props.codes)}
                        logout={this.props.logout}
                    />

                    <div style={{width: '85vw', height: '100vh'}}>
                        <div className="main">
                            {this.componentToDisplay(this.state.selectedItem)}
                        </div>
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

function mapStateToProps (state) {
	return {
		isLoggedIn: state.isLoggedIn,
		authToken: state.authToken,
		currentUser: state.currentUser,
		currentUserUid: state.currentUserUid,
		currentBrandName: state.currentBrandName,
		currentBrandId: state.currentBrandId,
		currentEvent: state.currentEvent,
        codes: state.codes
	}
}

function mapDispatchToProps (dispatch){
	return bindActionCreators(actionCreators, dispatch);
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))

