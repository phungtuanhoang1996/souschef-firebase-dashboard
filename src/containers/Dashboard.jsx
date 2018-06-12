import React from 'react';
import DrawerNavComponent from '../components/drawer/DrawerNavComponent';
import OverviewComponent from '../containers/Overview/OverviewComponent';
import {bindActionCreators} from "redux";
import * as actionCreators from "../actions/actionCreators";
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import logger from "../Utils/logger";
import QrCodesComponent from "./Overview/QrCodesComponent";
import { Sidebar, Segment } from 'semantic-ui-react'

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedItem: 'codes'
        }
    }

    componentToDisplay = (selectedItem) => {
        switch (selectedItem) {
            case 'overview': return (<OverviewComponent/>)
            case 'machines': return null //this needs to be done
            case 'codes': return (<QrCodesComponent/>) //this needs to be done
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
                        onItemSelect={this.onItemSelect}
                        selectedItem={this.state.selectedItem}
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
		currentBrandId: state.currentBrandId
	}
}

function mapDispatchToProps (dispatch){
	return bindActionCreators(actionCreators, dispatch);
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))

