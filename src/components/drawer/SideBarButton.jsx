import React from 'react'
import chosenBar from '../../resources/icons/chosen-bar.png'

const SideBarButton = (props) => {
	return (
		<div style={{display: 'flex', backgroundColor: props.selected ? '#455A72' : '#4A607A', width: '100%'}}
		     onClick={() => {props.onItemSelect(props.item)}}
		>
			<div style={{
				color: 'white', display: 'table'
			}}>
				<img src={props.icon} alt='icon' width='40' height='40' style={{display: 'table-cell',marginRight: '5px'}}/>
				<div style={{
					display: 'table-cell',
					verticalAlign: 'middle',
					alignContent: 'left'
				}}>
					{props.buttonText}
				</div>
			</div>
			{props.selected ? <img height='40' src={chosenBar} alt='Chosen Bar' style={{float: 'right', marginLeft: 'auto'}}/> : null}
		</div>
	)
}

export default SideBarButton