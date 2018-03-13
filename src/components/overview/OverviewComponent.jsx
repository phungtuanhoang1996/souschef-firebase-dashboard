import React from 'react';
import AvailableMachinesComponent from './AvailableMachinesComponent';
import './OverviewComponent.css';

export default class OverviewComponent extends React.Component {
    render () {
        return (
            <div className="wrapper">
                <AvailableMachinesComponent/>
                {/* {AvailableMachines} */}
            </div>
        );
    }
}