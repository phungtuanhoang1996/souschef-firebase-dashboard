import React from 'react';
import { Segment, Divider, Button } from 'semantic-ui-react'
import brandIcon from '../../resources/icons/brand-icon.png'
import SideBarButton from './SideBarButton'
import buttonIcon from '../../resources/icons/button-icon.png'
import firebase from 'firebase'
import logger from "../../Utils/logger";

export default class DrawerNavComponent extends React.Component {
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
				    <div style={{display: 'inline-table'}}>
				        <img src={brandIcon} alt='brand icon' width='25' height='25' style={{marginRight: '5px'}}/>
					    <div style={{display: 'table-cell', verticalAlign: 'middle', color: 'white'}}>Your brand</div>
				    </div>
			    </div>
			    <h5 align="center" style={{backgroundColor: '#354455', color: 'white', paddingBottom: '10px', paddingTop: '5px', margin: '0px'}}>{this.props.currentBrandName ? this.props.currentBrandName : "Loading..."}</h5>

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
		    </Segment>
	    )
    }

	onItemSelect = (item) => {
		this.props.onItemSelect(item)
	}
}