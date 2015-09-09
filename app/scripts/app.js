
var React = window.React = require('react'),
    ReactAddons = require('react/addons'),
    ReactGoogleMap = require('react-google-maps').GoogleMap,
    Marker = require('react-google-maps').Marker,
    InfoWindow = require('react-google-maps').InfoWindow,
    BusStop = require('./components/BusStop'),
    merge = require('lodash/object/merge'),
    mountNode = document.getElementById('app');

var API_URL = 'http://digitaslbi-id-test.herokuapp.com/bus-stops';

var TflApp = React.createClass({
  getInitialState: function () {
    return {
      errorFound: false,
      errorMessage: '',
      markers: []
    };
  },

  componentDidMount: function () {
    $.ajax({
      url: API_URL + '?northEast=51.52783450,-0.04076115&southWest=51.51560467,-0.10225884',
      jsonp: 'callback',
      dataType: 'jsonp',
      success: this.onDataReceived,
      error: this.onError
    });
  },

  onDataReceived: function(data) {
    if (this.isMounted()) {
      this.setState({
        markers: data.markers
      });
    }
  },

  onError: function(jqXHR) {
    if (jqXHR.status === 400) {
      // Show error on the page
      this.setState({
        errorFound: true,
        errorMessage: jqXHR.errorMessage
      });
    }
  },

  handle_info_click: function(marker, e) {
    e.preventDefault();

    var mergedBusData;

    $.ajax({
      url: API_URL + '/' + marker.id,
      jsonp: 'callback',
      dataType: 'jsonp',
      success: function(data) {
        mergedBusData = merge(marker, data);
      }
    }).done(function() {
      this.goToElement('.bus-data-container');

      this.setState({
        busData: mergedBusData
      });
    }.bind(this));
  },

  handle_marker_click: function(marker) {
    marker.showInfo = true;
    this.setState(this.state);
  },

  handle_closeclick: function(marker) {
    marker.showInfo = false;
    this.setState(this.state);
  },

  render_InfoWindow: function(ref, marker) {
    return (
      <InfoWindow key={`${ref}_info_window`}
        onCloseclick={this.handle_closeclick.bind(this, marker)}
      >
        <div>
          <p>Route {marker.id}</p>
          <p><strong>{marker.name}</strong></p>
          <a href="#" onClick={this.handle_info_click.bind(this, marker)}>Show arrival times</a>
        </div>
      </InfoWindow>
    );
  },

  goToElement: function(className) {
    $('body').animate({
      scrollTop: $(className).offset().top
    }, 200);
  },

  renderBusData: function() {
    if (this.state.busData) {
      return (
        <BusStop data={this.state.busData} />
      );
    }
  },

  renderError: function() {
    if (this.state.errorFound) {
      return (
        <p className="text-danger">{this.state.errorMessage}</p>
      );
    }
  },

  render: function() {
    return (
      <div>
        <div className="col-lg-8">
          <h3>Tfl Bus App</h3>
          <p>Click the red marker to view the timetable.</p>

          {this.renderError()}

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
                    onClick={this.handle_marker_click.bind(this, marker)}>
                    {marker.showInfo ? this.render_InfoWindow(ref, marker) : null}
                  </Marker>
                );
              })}
          </ReactGoogleMap>
        </div>

        <div className="bus-data-container col-lg-4">
          {this.renderBusData()}
        </div>

      </div>
    );
  }
});


React.render(<TflApp />, mountNode);

