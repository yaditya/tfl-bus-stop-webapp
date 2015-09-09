var React = window.React = require('react');
var ReactProptypes = React.PropTypes;
var GoogleMap = require('react-google-maps').GoogleMap;
var Marker = require('react-google-maps').Marker;
var InfoWindow = require('react-google-maps').InfoWindow;
var ServicesList = require('./ServicesList');
var BusStop = require('./BusStop');
var merge = require('lodash/object/merge');

var API_URL = 'http://digitaslbi-id-test.herokuapp.com/bus-stops';

var Content = React.createClass({
    getInitialState: function getInitialState() {
        return {
            errorFound: false,
            errorMessage: '',
            markers: [],
            selectedOption: 'map'
        }
    },

    componentDidMount: function componentDidMount() {
      this.loadData();
    },

    loadData: function loadData() {
        $.ajax({
          url: API_URL + '?northEast=51.52783450,-0.04076115&southWest=51.51560467,-0.10225884',
          jsonp: 'callback',
          dataType: 'jsonp',
          success: this.onDataReceived,
          error: this.onError
        });
    },

    onDataReceived: function onDataReceived(data) {
      if (this.isMounted()) {
        this.setState({
          markers: data.markers
        });
      }
    },

    onError: function onError(jqXHR) {
      if (jqXHR.status === 400) {
        // Show error on the page
        this.setState({
          errorFound: true,
          errorMessage: jqXHR.errorMessage
        });
      }
    },

    handleDropdownChange: function handleDropdownChange(e) {
        this.setState({
            busData: {},
            selectedOption: e.target.value
        })
    },

    handleInfoClick: function handleInfoClick(marker, e) {
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

    handleMarkerClick: function handleMarkerClick(marker) {
      marker.showInfo = true;
      this.setState(this.state);
    },

    handleCloseClick: function handleCloseClick(marker) {
      marker.showInfo = false;
      this.setState(this.state);
    },

    renderInfoWindow: function renderInfoWindow(ref, marker) {
      return (
        <InfoWindow key={`${ref}_info_window`}
          onCloseclick={this.handleCloseClick.bind(this, marker)}
        >
          <div>
            <p>Route {marker.id}</p>
            <p><strong>{marker.name}</strong></p>
            <a href="#" onClick={this.handleInfoClick.bind(this, marker)}>Show arrival times</a>
          </div>
        </InfoWindow>
      );
    },

    goToElement: function goToElement(className) {
      $('body').animate({
        scrollTop: $(className).offset().top
      }, 200);
    },

    renderBusData: function renderBusData() {
      if (this.state.busData) {
        return (
          <BusStop data={this.state.busData} />
        );
      }
    },

    renderError: function renderError() {
      if (this.state.errorFound) {
        return (
          <p className="text-danger">{this.state.errorMessage}</p>
        );
      }
    },

    renderHeaderText: function renderHeaderText() {
        switch(this.state.selectedOption) {
            case 'map':
                return 'Click red marker to see the selected stop details.';
                break;
            case 'list':
                return 'Click the stop name to see the bus arrival times.';
                break;
        }
    },

    renderBusServiceList: function renderBusServiceList() {
        var component;

        switch(this.state.selectedOption) {
            case 'map':
                component = (
                    <GoogleMap containerProps={{
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
                              onClick={this.handleMarkerClick.bind(this, marker)}>
                              {marker.showInfo ? this.renderInfoWindow(ref, marker) : null}
                            </Marker>
                          );
                        })}
                    </GoogleMap>
                )
                break;
            case 'list':
                component = (
                    <ServicesList data={this.state.markers} onSelectedRoute={this.handleInfoClick} />
                );
                break;
        }

        return component;
    },

    render: function render() {
        return (
            <div>
                <div className="col-lg-8">
                    <h3>Tfl Bus App</h3>
                    {this.renderError()}

                    <p>Select services view: </p>
                    <select className="form-control" onChange={this.handleDropdownChange} value={this.state.value}>
                        <option value="map">Map</option>
                        <option value="list">List</option>
                    </select>

                    <section className="bus-service-container">
                        <header>
                            <h4>{this.renderHeaderText()}</h4>
                        </header>
                        {this.renderBusServiceList()}
                    </section>
                </div>

                <div className="bus-data-container col-lg-4">
                    {this.renderBusData()}
                </div>
            </div>
        );
    }
});

module.exports = Content
