
var React = window.React = require('react'),
    ReactAddons = require('react/addons'),
    AppContent = require('./components/Content'),
    mountNode = document.getElementById('app');


var TflApp = React.createClass({
  render: function render() {
    return (
        <div>
          <AppContent />
        </div>
    );
  }
});


React.render(<TflApp />, mountNode);

