import React from 'react'
import {Modal, List} from 'semantic-ui-react'
import {bindActionCreators} from "redux";
import * as actionCreators from "../../../actions/actionCreators";
import {connect} from "react-redux"

class SelectEventModal extends React.Component {
	render() {
		return (
			<Modal closeIcon dimmer={'blurring'}
			       size='mini'
			       open={this.props.open}
			       onClose={this.props.onClose}
			>
				<Modal.Header>Select Event</Modal.Header>
				<Modal.Content>
					{/*{*/}
						{/*this.props.events.map(event => {*/}
							{/*return (*/}
								{/*<div onClick={() => this.props.setCurrentEvent(event)}>{event}</div>*/}
							{/*)*/}
						{/*})*/}
					{/*}*/}
					<List divided relaxed>
						{
							this.props.events.map(event => {
								return (
									<List.Item onClick={() => {
										this.props.setCurrentEvent(event)
										this.props.onClose()
									}}>
										<List.Header>{event}</List.Header>
									</List.Item>
								)
							})
						}
					</List>
				</Modal.Content>
			</Modal>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		events: Object.keys(state.codes)
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectEventModal)