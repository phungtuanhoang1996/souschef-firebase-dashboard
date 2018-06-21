import React from 'react';
import CodeCardComponent from './components/CodeCardComponent';
import './QrCodesComponent.css';
import {styled} from 'styled-components';
import {connect} from 'react-redux'
import NewCodeModal from './components/NewCodeModal'
import logger from "../../Utils/logger";
import ImportCsvModal from "./components/ImportCsvModal";
import ImportXlsxModal from "./components/ImportXlsxModal"
import {Segment, Button, Card, Icon} from "semantic-ui-react";

const mapStateToProps = (state) => {
	return {
		currentBrandId: state.currentBrandId,
		ongoingCodes: state.ongoingCodes,
		offgoingCodes: state.offgoingCodes,
		machinesData: state.machinesData
	}
}

class QrCodesComponent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			event: 'ongoing',
			newCodeModal: false,
			newCodeModalDetails: null,
			codeModificationModal: false,
			codeModificationDetails: null,
			importCsvModal: false,
			importXlsxModal: false
		}
	}

	/*
		returns object of online / offline machines from an object of mixed
	 */
	getMachines = (machinesObject, option) => {
		let sortedMachines = {}

		Object.keys(machinesObject).map(key => {
			if (machinesObject[key]['online'] && option === 'online') {
				sortedMachines[key] = machinesObject[key]
			} else if (!machinesObject[key]['online'] && option === 'offline') {
				sortedMachines[key] = machinesObject[key]
			}
		})

		logger(option + 'sorted machines', sortedMachines)
		return sortedMachines
	}


	toggleNewCodeModal = () => {
		this.setState({
			newCodeModal: !this.state.newCodeModal,
		})
	}

	showImportCsvModal = () => {
		this.setState({
			importCsvModal: true
		})
	}

	closeImportCsvModal = () => {
		this.setState({
			importCsvModal: false
		})
	}

	showImportXlsxModal = () => {
		this.setState({
			importXlsxModal: true
		})
	}

	closeImportXlsxModal = () => {
		logger('close xlsx modal called')
		this.setState({
			importXlsxModal: false
		})
	}


	render() {
		return (
			<div className="qrCodesWrapper">
				<div style={{
					display: 'flex',
					height: '70vh',
					margin: '0px',
					padding: '10px',
					paddingBottom: '5px'
				}}>
					<CodeCardComponent
						firebaseOngoingCodes={this.props.ongoingCodes}
						firebaseOffgoingCodes={this.props.offgoingCodes}
						currentBrandId={this.props.currentBrandId}
					/>
				</div>

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
						<h2 style={{padding: '10px', paddingLeft: '20px', margin: '0px'}}>Codes Management Utilities</h2>

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
										<h3 align='center'>Import multiple codes from a .CSV file</h3>
									</Card.Content>

									<Card.Content style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
										<Button color={'teal'} style={{flex: 'none'}}
										        onClick={this.showImportCsvModal}
										>
											<Icon name='upload' inverted/>
											Import
										</Button>
									</Card.Content>
								</Card>
							</div>

							<div style={{
								flex: 'none',
								marginLeft: '10px',
								display: 'flex'
							}}>
								<Card style={{
									flex: '1'
								}}>
									<Card.Content style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#C1D3E9'}}>
										<h3 align='center'>Import multiple codes from a .XLS/.XLSX file</h3>
									</Card.Content>

									<Card.Content style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
											<Button color={'teal'} style={{flex: 'none'}}
											        onClick={this.showImportXlsxModal}
											>
												<Icon name='upload' inverted/>
												Import
											</Button>
									</Card.Content>
								</Card>
							</div>
						</div>
					</Segment>
				</div>

				<NewCodeModal
					isOpen={this.state.newCodeModal}
					toggle={this.toggleNewCodeModal}
					details={this.state.newCodeModalDetails}
				/>
				<ImportCsvModal
					isOpen={this.state.importCsvModal}
					close={this.closeImportCsvModal}
					currentBrandId={this.props.currentBrandId}
				/>
				<ImportXlsxModal
					isOpen={this.state.importXlsxModal}
					close={this.closeImportXlsxModal}
					currentBrandId={this.props.currentBrandId}
				/>
			</div>
		)
	}
}

export default connect(mapStateToProps, null)(QrCodesComponent)
