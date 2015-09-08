import React, {PropTypes} from 'react';

var BusStop = React.createClass({
    propTypes: {
        data: PropTypes.object.isRequired
    },

    render: function () {
        const data = this.props.data;
        const arrivals = data.arrivals;

        return (
            <section className="bus-stop">
                <header>
                    Bus arrival times for:<br />
                    <h3>{data.id} {data.name}</h3>
                </header>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Route</th>
                            <th>Destination</th>
                            <th>Wait time</th>
                            <th>Arrival</th>
                        </tr>
                    </thead>
                    <tbody>
                    {arrivals.map((arrival, index) => {
                        return (
                            <tr>
                                <td>{arrival.routeName}</td>
                                <td>{arrival.destination}</td>
                                <td>{arrival.estimatedWait}</td>
                                <td>{arrival.scheduledTime}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </section>
        );
    }
});

module.exports = BusStop;
