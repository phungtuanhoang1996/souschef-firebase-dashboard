import React, {Component} from 'react';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardTitle,
	CardSubtitle,
	Col,
	DropdownItem,
	DropdownToggle,
	DropdownMenu,
	Row,
	Table,
	UncontrolledDropdown,
	InputGroup,
	Input,
	InputGroupAddon
} from 'reactstrap';

export default class CodeCardComponent extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedEvent: 'ongoing',
			filterKeyword: ''
		}
	}

	codesTypeTobeShown = () => {
		if (this.state.selectedEvent === 'ongoing') return this.filterCode(this.props.firebaseOngoingCodes, this.state.filterKeyword)
		else if (this.state.selectedEvent === 'offgoing') return this.filterCode(this.props.firebaseOffgoingCodes, this.state.filterKeyword)
		else return {}
	}

	totalCodesCount = (!this.props.firebaseOffgoingCodes || !this.props.firebaseOngoingCodes) ? 0 : Object.keys(this.props.firebaseOngoingCodes).length + Object.keys(this.props.firebaseOffgoingCodes).length

	changeSelectedEvent = (event) => {
		this.setState({
			selectedEvent: event
		})
	}

	handleFilterKeywordChange = (event) => {
		this.setState({
			filterKeyword: event.target.value
		})
	}

	filterCode = (codes, keyword) => {
		if (keyword === '') return codes

		var filteredCodes = {}

		Object.keys(codes).map(key => {
			if (key.startsWith(keyword)) filteredCodes[key] = codes[key]
		})

		return filteredCodes
	}

	render() {
		return (
			<Card>
				<CardHeader>Event Codes</CardHeader>
				<CardBody>
					<CardTitle className="text-center">
						Code Count: {' '}
						{
							this.totalCodesCount
						}
					</CardTitle>
					<CardSubtitle style={{marginBottom: '5px', display: "flex"}}>
						<UncontrolledDropdown style={{marginRight: '5px'}}>
							<DropdownToggle caret>
								{this.state.selectedEvent}
							</DropdownToggle>
							<DropdownMenu>
								<DropdownItem onClick={(e) => {
									this.changeSelectedEvent('ongoing')
								}}>ongoing</DropdownItem>
								<DropdownItem divider/>
								<DropdownItem onClick={(e) => {
									this.changeSelectedEvent('offgoing')
								}}>offgoing</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>

						<InputGroup size='normal' style={{marginLeft: '5px', marginRight: '5px'}}>
							<Input
								value={this.state.filterKeyword}
								onChange={(event) => {
									this.handleFilterKeywordChange(event)
								}}
							>
							</Input>
							<InputGroupAddon addonType='append'>
								<Button onClick={() => {
								}}>QR Scanner</Button>
								{/*this is to be done*/}
							</InputGroupAddon>
						</InputGroup>

						<Button
							color="primary"
							onClick={() => {
								this.props.onNewCodeButtonClicked()
							}}>Add
						</Button>
					</CardSubtitle>
					<Table striped bordered>
						<thead>
						<tr>
							<th width="40%">Code</th>
							<th width="15%">Uses Left</th>
							<th width="15%">Start Date</th>
							<th width="15%">End Date</th>
							<th width="15%"></th>
						</tr>
						</thead>
						<tbody>
						{
							this.totalCodesCount != 0 ?
								Object.keys(this.codesTypeTobeShown()).map((code) => {
									return <tr key={code.toString()}>
										<td style={styles.tableData}>
											{code}
										</td>
										<td style={styles.tableData}>
											{this.codesTypeTobeShown()[code].use_count}
										</td>
										<td style={styles.tableData}>
											{
												this.codesTypeTobeShown()[code].start_date != "" ? this.codesTypeTobeShown()[code].start_date : "N/A"
											}
										</td>
										<td style={styles.tableData}>
											{
												this.codesTypeTobeShown()[code].end_date != "" ? this.codesTypeTobeShown()[code].end_date : "N/A"
											}
										</td>
										<td style={styles.modifyButtonCell}>
											<Button onClick={() => {
												this.props.onModifyButtonClicked(code,
													this.codesTypeTobeShown()[code].start_date,
													this.codesTypeTobeShown()[code].end_date,
													this.codesTypeTobeShown()[code].use_count
												)
											}
											}
											>
												Modify
											</Button>
										</td>
									</tr>
								})
								: null
						}
						</tbody>
					</Table>
				</CardBody>
			</Card>
		)
	}
}

const styles = {
	tableData: {
		verticalAlign: "middle",
	},
	modifyButtonCell: {
		textAlign: "center"
	}
}