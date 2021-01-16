
'use strict';

var addGPSTrack;

class GMap extends React.Component{
  constructor(props){
    super(props)


    this.poly;
    this.rover;
    this.map;
    this.center_gps = new google.maps.LatLng(43.571105, 1.466366);
    this.html = React.createRef();
    
    // Variable used to draw/delete a trajectory
    this.mapPath; //Last point placed on the map
    this.path = new Array(); // Set of coordinate got from the map

    //Create the topic object used to send the trajectory
    var cmdVel = new ROSLIB.Topic({
      ros : ros,
      name : '/hmi_waypoint',
      messageType : 'geometry_msgs/PoseStamped'
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
    this.addGPSTrack = this.addGPSTrack.bind(this);
    //this.showLastCoordinates = this.showLastCoordinates.bind(this);

    //Will contain the GPS values
    this.coordinates = {
      latitude : 0,
      longitude : 0,
      altitude : 0,
      status:{
        service : 0
      }
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
      strokeColor: '#F00000',
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
      name : '/android/fix', //'/ros_GPS',
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
    this.mapPath = event.latLng;//.toString();   
    
    console.log(event.LatLng);

    this.coordinates.latitude = event.latLng.lat();
    this.coordinates.longitude = event.latLng.lng();

    this.coordinates.clicked = true;
  }

  addLine() {
    this.poly.setMap(this.map);
  }


  removeLine() {
    this.map = null;
    this.poly.setMap(this.map);
  //poly = [{lat : 0, long : 0}];
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
    var poseStamped = {
      header : {
        seq : 0.0,
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
    };
    
    // Send the coordinates
    var twist = new ROSLIB.Message(poseStamped);
    this.cmdPath.publish(twist);
    

  }

  showLastCoordinates(){
    var content = (this.coordinates.clicked) ? 
      <div>
          <button onClick={this.removeLine}>Remove waypoints</button>
          <button onClick={this.followTrajectory()}>Follow</button>
          <small>Last coordinates (lat:{this.coordinates.latitude}, lng:{this.coordinates.longitude})</small>
      </div>:
      "";
    return content;
  }

  //When loaded
  componentDidMount(){
    this.initMap();
    this.initGPSTrack();
  }

  followTrajectory(){
      var cmdFollowTrajectory = new ROSLIB.Topic({
        ros : ros,
        name : '/start_trajectory',
        messageType : 'bool'
      });

      cmdFollowTrajectory.publish(new ROSLIB.Message(true));
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



