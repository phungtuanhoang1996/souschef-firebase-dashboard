import React from 'react'
import {connect} from 'react-redux'
import {Segment, Button, Card, Icon} from 'semantic-ui-react'
import NewEventModal from './components/NewEventModal'

class EventsComponent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			newEventModal: false,
		}
	}

	render() {
		return (
			<div>
				<div style={{
					display: 'flex',
					height: '30vh',
					margin: '0px',
					padding: '10px',
					paddingTop: '5px'
				}}>
					<Segment raised style={{
						flex: '1',
						margin: '0px',
						padding: '0px',
						display: 'flex',
						flexDirection: 'column'
					}}>
						<h2 style={{padding: '10px', paddingLeft: '20px', margin: '0px'}}>Events Management Utilities</h2>

						<div style={{
							flex: '1',
							margin: '0px',
							padding: '20px', paddingTop: '0px',
							display: 'flex'
						}}>
							<div style={{
								flex: 'none',
								marginRight: '10px',
								display: 'flex'
							}}>
								<Card style={{
									flex: '1'
								}}>
									<Card.Content style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#C1D3E9'}}>
										<h3 align='center'>Create a new event</h3>
									</Card.Content>

									<Card.Content style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
										<Button color={'teal'} style={{flex: 'none'}}
										        onClick={this.showNewEventModal}
										>
											<Icon name='calendar alternate outline' inverted/>
											Create
										</Button>
									</Card.Content>
								</Card>

								<NewEventModal
									open={this.state.newEventModal}
									onClose={this.closeNewEventModal}
									currentBrandId={this.props.currentBrandId}
								/>
							</div>
						</div>
					</Segment>
				</div>
			</div>
		)
	}

	showNewEventModal = () => {
		this.setState({
			newEventModal: true
		})
	}

	closeNewEventModal = () => {
		this.setState({
			newEventModal: false
		})
	}
}

const mapStateToProps = (state) => {
	return {
		currentBrandId: state.currentBrandId
	}
}

export default connect(mapStateToProps, null)(EventsComponent)