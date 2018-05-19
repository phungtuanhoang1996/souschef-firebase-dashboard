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
import bindFirebaseBrand from '../../../FirebaseUtils/bindFirebaseBrand'

const CodeCardComponent = (props) => {
	console.log("code card old props")
	console.log(props.codes)

	const codesTypeToBeShown = () => {
		if (props.selectedEvent === 'ongoing') return props.firebaseCodesOngoing
		else if (props.selectedEvent === 'offgoing') return props.firebaseCodesOffgoing
	}

	var totalCodesCount = (!props.firebaseCodesOffgoing || !props.firebaseCodesOngoing) ? 0 : Object.keys(props.firebaseCodesOngoing).length + Object.keys(props.firebaseCodesOffgoing).length

	return (
		<Card>
			<CardHeader>Event Codes</CardHeader>
			<CardBody>
				<CardTitle className="text-center">
					Code Count: {' '}
					{console.log(props.codes)}
					{console.log(Object.keys(props.codes).length)}
					{
						totalCodesCount
					}
				</CardTitle>
				<CardSubtitle style={{marginBottom: '5px', display: "flex"}}>
					<UncontrolledDropdown style={{marginRight: '5px'}}>
						<DropdownToggle caret>
							{props.selectedEvent}
						</DropdownToggle>
						<DropdownMenu>
							<DropdownItem header>Event</DropdownItem>
							<DropdownItem divider/>
							{
								Object.keys(props.codes).map((event, i) => {
									if (i !== Object.keys(props.codes).length - 1) {
										return (
											<div key={i}>
												<DropdownItem key={i} onClick={(e) => {
													props.changeSelectedEvent(event)
												}}>
													{event}
												</DropdownItem>
												<DropdownItem divider/>
											</div>
										)
									} else {
										return (
											<div key={i}>
												<DropdownItem key={i} onClick={(e) => {
													props.changeSelectedEvent(event)
												}}>
													{event}
												</DropdownItem>
											</div>
										)
									}
								})
							}
						</DropdownMenu>
					</UncontrolledDropdown>

					<InputGroup size='normal' style={{marginLeft: '5px', marginRight: '5px'}}>
						<Input
							//this is to be done
						>
						</Input>
						<InputGroupAddon addonType='append'>
							<Button onClick={() => {}}>QR Scanner</Button>
							{/*this is to be done*/}
						</InputGroupAddon>
					</InputGroup>

					<Button color="primary">Add</Button>
					{/*this is to be done*/}
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
						totalCodesCount != 0 ?
							Object.keys(codesTypeToBeShown()).map((code) => {
								return <tr>
									<td style={styles.tableData}>
										{code}
									</td>
									<td style={styles.tableData}>
										{codesTypeToBeShown()[code].use_count}
									</td>
									<td style={styles.tableData}>
										{
											codesTypeToBeShown()[code].start_date != "" ? codesTypeToBeShown()[code].start_date : "N/A"
										}
									</td>
									<td style={styles.tableData}>
										{
											codesTypeToBeShown()[code].end_date != "" ? codesTypeToBeShown()[code].end_date : "N/A"
										}
									</td>
									<td style={styles.modifyButtonCell}>
										<Button onClick={() => {
											props.onModifyButtonClicked(code,
												codesTypeToBeShown()[code].start_date,
												codesTypeToBeShown()[code].end_date,
												codesTypeToBeShown()[code].use_count
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
	);
}

const styles = {
	tableData: {
		verticalAlign: "middle",
	},
	modifyButtonCell: {
		textAlign: "center"
	}
}

export default bindFirebaseBrand(CodeCardComponent)
