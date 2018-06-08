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

const CodeCardComponent = (props) => {
	const codesTypeToBeShown = () => {
		if (props.selectedEvent === 'ongoing') return props.firebaseOngoingCodes
		else if (props.selectedEvent === 'offgoing') return props.firebaseOffgoingCodes
	}

	var totalCodesCount = (!props.firebaseOffgoingCodes || !props.firebaseOngoingCodes) ? 0 : Object.keys(props.firebaseOngoingCodes).length + Object.keys(props.firebaseOffgoingCodes).length

	return (
		<Card>
			<CardHeader>Event Codes</CardHeader>
			<CardBody>
				<CardTitle className="text-center">
					Code Count: {' '}
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
							<DropdownItem onClick={(e) => {
								props.changeSelectedEvent('ongoing')
							}}>ongoing</DropdownItem>
							<DropdownItem divider/>
							<DropdownItem onClick={(e) => {
								props.changeSelectedEvent('offgoing')
							}}>offgoing</DropdownItem>
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

					<Button
						color="primary"
						onClick={() => {props.onNewCodeButtonClicked()}}>Add
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
						totalCodesCount != 0 ?
							Object.keys(codesTypeToBeShown()).map((code) => {
								return <tr key={code.toString()}>
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

export default CodeCardComponent
