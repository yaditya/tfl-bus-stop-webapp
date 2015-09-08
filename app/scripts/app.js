
var React = require('react'),
    ReactAddons = require('react/addons'),
    ReactGoogleMap = require('react-google-maps').GoogleMap,
    Marker = require('react-google-maps').Marker,
    InfoWindow = require('react-google-maps').InfoWindow,
    BusStop = require('./components/BusStop'),
    merge = require('lodash/object/merge'),
    mountNode = document.getElementById('app');

var TflApp = React.createClass({
  getInitialState: function () {
    return {
      markers: []
    };
  },

  componentDidMount: function () {
    $.ajax({
      url: 'http://digitaslbi-id-test.herokuapp.com/bus-stops?northEast=51.52783450,-0.04076115&southWest=51.51560467,-0.10225884',
      jsonp: 'callback',
      dataType: 'jsonp',
      success: this.onDataReceived
    })
  },

  onDataReceived: function(data) {
    if (this.isMounted()) {
      this.setState({
        markers: data.markers
      });
    }
  },

  handle_marker_click: function(marker) {
    var mergedBusData;

    $.ajax({
      url: 'http://digitaslbi-id-test.herokuapp.com/bus-stops/' + marker.id,
      jsonp: 'callback',
      dataType: 'jsonp',
      success: function(data) {
        mergedBusData = merge(marker, data);
      }
    }).done(function() {
      this.setState({
        busData: mergedBusData
      });
    }.bind(this));
  },

  renderBusData: function() {
    if (this.state.busData) {
      /* jshint ignore:start */
      return (
        <BusStop data={this.state.busData} />
      );
      /* jshint ignore:end */
    }
  },

  render: function() {
    return (
      <div>
        <div className="col-lg-8">
          <h3>Tfl Bus App</h3>
          <p>Click the red marker to view the timetable.</p>


          <ReactGoogleMap containerProps={{
              ...this.props,
              className: "map",
            }}
            ref="map"
            defaultZoom={15}
            defaultCenter={{lat: 51.5246159, lng: -0.0718099}}>
              {this.state.markers.map((marker, index) => {
                var position = new google.maps.LatLng(
                  marker.lat,
                  marker.lng
                );
                var ref = `marker-${index}`;

                return (
                  <Marker
                    ref={ref}
                    position={position}
                    key={ref}
                    onClick={this.handle_marker_click.bind(this, marker)} />
                );
              })}
          </ReactGoogleMap>
        </div>

        <div className="col-lg-4">
          {this.renderBusData()}
        </div>

      </div>
    );
  }
});


React.render(<TflApp />, mountNode);

