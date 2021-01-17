
'use strict';

var addGPSTrack;

//constant to be sent through /hmi_state
var HMI_STATE_EDIT = new ROSLIB.Message({
  data : 0
});
var HMI_STATE_REMOVE = new ROSLIB.Message({
  data : 2
});
var HMI_STATE_DELETE = new ROSLIB.Message({
  data : 3
});
var HMI_STATE_FOLLOW = new ROSLIB.Message({
  data : 1
});

class GMap extends React.Component{
  constructor(props){
    super(props)


    this.poly;
    this.rover;
    this.map;
    this.center_gps = new google.maps.LatLng(43.571105, 1.466366);
    this.html = React.createRef();
    this.loaded = false;
    
    // Variable used to draw/delete a trajectory
    this.mapPath; //Last point placed on the map
    this.path = new Array(); // Set of coordinate got from the map

    //Create the topic object used to send the trajectory
    this.cmdWaypoints = new ROSLIB.Topic({
      ros : ros,
      name : '/hmi_wp',
      messageType : 'geometry_msgs/PoseStamped'
    });

    this.cmdTrajectoryState = new ROSLIB.Topic({
      ros : ros,
      name : '/hmi_state',
      messageType : 'std_msgs/Int16'
    });

    /** Requires
     * Latitude
     * Longitude
     * Zoom
     * 
     */

    //Make initMap linked to the React object when used from outside the object
    this.initMap = this.initMap.bind(this);
    this.addLatLng = this.addLatLng.bind(this);
    this.addLine = this.addLine.bind(this);
    this.removeLine = this.removeLine.bind(this);
    this.editWp = this.editWp.bind(this);
    this.followTrajectory = this.followTrajectory.bind(this);
    this.removeLastPoint = this.removeLastPoint.bind(this);
    this.addGPSTrack = this.addGPSTrack.bind(this);
    this.sendCoordinatesMessage = this.sendCoordinatesMessage.bind(this);

    //Will contain the GPS values
    this.coordinates = {
      latitude : 0,
      longitude : 0,
      altitude : 0,
      status:{
        service : 0
      },
      numberOfWaypoints : 0,
      seq : 0
    };
  }

  initMap(){
    let element = this.html.current;

    this.map = new google.maps.Map(element, {
      zoom: 18,
      center: this.center_gps,
      mapTypeId: "satellite"
    });

    this.poly = new google.maps.Polyline({
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 3
    });
    this.poly.setMap(this.map);

    this.rover = new google.maps.Polyline({
      strokeColor: '#00FF33',
      strokeOpacity: 1.0,
      strokeWeight: 3
    });
    this.rover.setMap(this.map);


    // Add a listener for the click event
    this.map.addListener('click', this.addLatLng);

    element.id = "map";
  }

  initGPSTrack(){
    var GPS_listener = new ROSLIB.Topic({
      ros : ros,
      name : '/pose_car/fix', 
      messageType : 'sensor_msgs/NavSatFix'
    });
  
    GPS_listener.subscribe(function(gps) {
      this.coordinates = gps;
      this.add_GPS_track();
    });
  }

  addLatLng(event){
    this.path = this.poly.getPath();

    // Because path is anshowLastCoordinates() MVCArray, we can simply append a new coordinate
    // and it will automatically appear.
    this.path.push(event.latLng);
    this.mapPath = event.latLng;

    this.coordinates.latitude = event.latLng.lat();
    this.coordinates.longitude = event.latLng.lng();

    this.coordinates.clicked = true;
    this.coordinates.numberOfWaypoints++;
    this.sendCoordinatesMessage();
  }

  addLine() {
    this.poly.setMap(this.map);
  }

  removeLastPoint(){
    this.path = this.poly.getPath().getArray();
    this.path.pop();
    this.poly.setPath(this.path);

    this.cmdTrajectoryState.publish(new ROSLIB.Message(HMI_STATE_REMOVE));
    this.coordinates.numberOfWaypoints--;
  }

  removeLine() {
    this.poly.setPath([]);
    
    this.cmdTrajectoryState.publish(new ROSLIB.Message(HMI_STATE_DELETE));
    this.coordinates.numberOfWaypoints = 0;
  }
  
  followTrajectory(){
    this.cmdTrajectoryState.publish(new ROSLIB.Message(HMI_STATE_FOLLOW));
  }
  
  editWp(){
    this.cmdTrajectoryState.publish(new ROSLIB.Message(HMI_STATE_EDIT));
  }

  ///trace sur maps le chemin du rover/////////////
  addGPSTrack() {
    if(this.rover == undefined) return false;
    var rover_Coords = new google.maps.LatLng(this.coordinates.latitude, this.coordinates.longitude);
    
    var rover_path = this.rover.getPath();

    // Because path is an MVCArray, we can simply append a new coordinate
    // and it will automatically appear.
    rover_path.push(rover_Coords);
    //rover.setMap("map");
    //document.getElementById("map_path").value = event.latLng;//.toString();   
  }

  sendCoordinatesMessage(){
    //Generate a ROSLib message
    var wpClicked = new ROSLIB.Message({
      header : {
        seq : this.coordinates.seq,
        stamp : new Date().getTime() / 1000, //Get a timestamp in a format equivalent to the python one
        frame_id : "map"
      },
      pose : {
        position:{
          x : this.coordinates.longitude,
          y : this.coordinates.latitude,
          z : 0.0
        },
        orientation:{
          x : 0.0,
          y : 0.0,
          z : 0.0, //Angle not asked animore
          w : 0.0
        }
      }
    });
    
    // Send the coordinates   
    this.cmdWaypoints.publish(wpClicked);
    this.coordinates.seq = this.coordinates.seq + 1;
  }

  showLastCoordinates(){
    var content = (this.coordinates.clicked) ? 
      <div>
      	  <button onClick={this.editWp}>Edit</button>
          <button onClick={this.removeLine}>Remove waypoints</button>
          <button onClick={this.removeLastPoint}>Remove last point</button>
          <button onClick={this.followTrajectory}>Follow</button>
          <small>Last coordinates (lat:{this.coordinates.latitude}, lng:{this.coordinates.longitude})</small>
      </div>:
      "";
    return content;
  }

  //When loaded
  componentDidMount(){
    this.initMap();
    this.initGPSTrack();
    
    this.loaded = true;
  }



  render(){
    /**            <button onClick={this.removeLine}>Remove line</button>
            <button onClick={this.addLine}>Add line</button> */
    return <div>
            <div id="map" ref={this.html}></div>
            {this.showLastCoordinates()}
          </div>;
  }
}



