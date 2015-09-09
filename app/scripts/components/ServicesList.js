var React = window.React = require('react');
var ReactProptypes = React.PropTypes;

var ServicesList = React.createClass({
    propTypes: {
        data: ReactProptypes.array.isRequired,
        onSelectedRoute: ReactProptypes.func
    },

    handleRouteClick: function handleRouteClick(marker, e) {
        e.preventDefault();

        this.props.onSelectedRoute(marker, e);
    },

    render: function render() {
        return (
            <ul className="list-unstyled">
                {this.props.data.map(function(marker, i) {
                    return (
                        <li key={i}><a href="#" onClick={this.handleRouteClick.bind(this, marker)}>{marker.name}</a></li>

                    );
                }.bind(this))}
            </ul>

        );
    }
});

module.exports = ServicesList;
