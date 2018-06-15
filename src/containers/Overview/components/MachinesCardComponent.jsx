import React from 'react';
import { Segment, Table } from 'semantic-ui-react'
import {styled} from 'styled-components';

const MachinesCardComponent = (props) => {
	let machinesCount = Object.keys(props.machines).length

    return (
        <div style={{flex: '1', paddingLeft: '20px', paddingRight: '20px'}}>
            <Segment textAlign='center' style={{
                margin: '0px', marginTop: '0px', marginBottom: '0px',
                backgroundColor: props.title === 'online' ? '#23BB9A' : '#E27676'
            }}>
                <h3 style={{color: 'white'}}>{machinesCount} machine{machinesCount >= 2 ? 's are ' : ' is '} {props.title}</h3>
            </Segment>

	        <Table celled striped style={{marginTop: '5px'}}>
		        <Table.Header>
			        <Table.HeaderCell textAlign='center' style={{width: '33%', backgroundColor: '#C2D4EA'}}>Name</Table.HeaderCell>
			        <Table.HeaderCell textAlign='center' style={{width: '67%', backgroundColor: '#C2D4EA'}}>Last Updated</Table.HeaderCell>
                </Table.Header>

                <Table.Body>
                    {
                        Object.keys(props.machines).map((machine, key) => {
	                        return (
	                            <Table.Row>
                                    <Table.Cell textAlign='center'>{machine}</Table.Cell>
                                    <Table.Cell textAlign='center'>{props.machines[machine].last_online}</Table.Cell>
                                </Table.Row>
                            )
                        })
                    }
                </Table.Body>
            </Table>
        </div>
    );
}

export default MachinesCardComponent;