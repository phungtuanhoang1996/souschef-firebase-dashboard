import React from 'react';
import { Segment, Divider, Button } from 'semantic-ui-react'
import brandIcon from '../../resources/icons/brand-icon.png'
import eventIcon from '../../resources/icons/event-icon.png'
import SideBarButton from './SideBarButton'
import buttonIcon from '../../resources/icons/button-icon.png'
import firebase from 'firebase'
import logger from "../../Utils/logger";
import SelectEventModal from "../../containers/Overview/components/SelectEventModal";

export default class DrawerNavComponent extends React.Component {
	constructor(props) {
		super()
		this.state = {
			selectEventModal: false
		}
	}

    render () {
	    return(
	    	<Segment
			    vertical={true}
			    style={{position: 'relative', backgroundColor: '#4A607A', width: '15%', height: '100vh', paddingTop:'0px', paddingBottom: '0px'}}
		    >
				<h3 align="center" style={{backgroundColor: '#354455', color: 'white', paddingBottom: '10px', paddingTop: '10px', margin: '0px'}}>Souschef Dashboard</h3>

			    <Divider fitted />

			    <p align="center" style={{backgroundColor: '#354455', color: 'white', paddingBottom: '5px', paddingTop: '10px', margin: '0px'}}>Welcome,</p>
			    <h5 align="center" style={{backgroundColor: '#354455', color: 'white', paddingBottom: '10px', paddingTop: '5px', margin: '0px'}}>{this.props.currentUser}</h5>

			    <Divider fitted/>

			    <div align="center" style={{backgroundColor: '#354455', paddingTop: '10px', paddingBottom: '5px', margin: '0px'}}>
				    <span style={{display: 'inline-flex', alignItems: 'center'}}>
					    <img src={brandIcon} alt='brand icon' width='25' height='25' style={{marginRight: '5px'}}/>
					    <div style={{display: 'table-cell', verticalAlign: 'middle', color: 'white'}}>Your brand</div>
				    </span>
			    </div>
			    <h5 align="center" style={{backgroundColor: '#354455', color: 'white', paddingBottom: '10px', paddingTop: '5px', margin: '0px'}}>{this.props.currentBrandName ? this.props.currentBrandName : "Loading..."}</h5>

			    <Divider fitted/>

			    <div align="center" style={{backgroundColor: '#354455', paddingTop: '10px', paddingBottom: '5px', margin: '0px'}}
			        onClick={this.openSelectEventModal}
			    >
				    <span style={{display: 'inline-flex', alignItems: 'center'}}>
					    <img src={eventIcon} alt='event icon' width='25' height='25' style={{marginRight: '5px'}}/>
					    <div style={{display: 'table-cell', verticalAlign: 'middle', color: 'white'}}>Current event</div>
				    </span>
			    </div>

				<h5 align="center" style={{backgroundColor: '#354455', paddingBottom: '10px', color: 'white', margin: '0px'}}
				    onClick={this.openSelectEventModal}
				>
					{this.props.currentEvent ? this.props.currentEvent : "Loading..."}
				</h5>

			    <Divider fitted />

			    <SideBarButton
				    item='overview'
			        buttonText="Overview"
			        icon={buttonIcon}
			        selected={this.props.selectedItem === 'overview'}
				    onItemSelect={this.onItemSelect}
			    />
			    <SideBarButton
				    item='machines'
				    buttonText="Machines"
				    icon={buttonIcon}
				    selected={this.props.selectedItem === 'machines'}
				    onItemSelect={this.onItemSelect}
			    />
			    <SideBarButton
				    item='codes'
				    buttonText="QR Codes"
				    icon={buttonIcon}
				    selected={this.props.selectedItem === 'codes'}
				    onItemSelect={this.onItemSelect}
			    />
			    <div style={{
			    	display: 'flex',
			    	backgroundColor: '#354455',
				    position: 'absolute',
				    bottom: '0',
				    width: '100%',
				    padding: '10px'
			    }}>
					<Button color='red' style={{margin: 'auto'}}
						onClick={() => {
							firebase.auth().signOut().then(success => {
								this.props.logout()
							}, error => {
								logger('logout failed')
							})
						}}
					>Logout</Button>
			    </div>

			    <SelectEventModal
			        open={this.state.selectEventModal}
			        onClose={this.closeSelectEventModal}
			    />
		    </Segment>
	    )
    }

    closeSelectEventModal = () => {
    	this.setState({
		    selectEventModal: false
	    })
    }

	openSelectEventModal = () => {
		this.setState({
			selectEventModal: true
		})
	}


	onItemSelect = (item) => {
		this.props.onItemSelect(item)
	}
}