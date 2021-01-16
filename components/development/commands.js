var speedValue = {
  linear : {
    x : 0.0,
    y : 0.0,
    z : 0.0
  },
  angular : {
    x : 0.0,
    y : 0.0,
    z : 0.0
  }
};
// Define the sensibility of the arrow keys, It increases while pressing for long time
var sensibility;

function SendMoveCommand(){
  var cmdVel = new ROSLIB.Topic({
    ros : ros,
    name : '/speed_cmd',
    messageType : 'geometry_msgs/Twist'
    });

    var twist = new ROSLIB.Message(speedValue);
    cmdVel.publish(twist);
}

function StopVehicle(){
  console.log("Stop the vehicle");
  speedValue.linear = {
    x:0.0, y: 0.0, z: 0.0
  }
  SendMoveCommand();
}

function TurnRight(){
  console.log("Turn to the right");
  if (speedValue.angular.z <= -30) {
    speedValue.angular.z = -30;
  } else {
    speedValue.angular.z -= 10;
  }
  SendMoveCommand();
  console.log(speedValue.angular.z);
}

function TurnLeft(){
  console.log("Turn to the left");
  if (speedValue.angular.z >= 30) {
    speedValue.angular.z = 30;
  } else {
    speedValue.angular.z += 10;
  }

  SendMoveCommand();
}

function MoveForward(){
  console.log("Move the vehicle Forward");
  if (speedValue.linear.x >= 60) {
    speedValue.linear.x = 60;
  } else {
    speedValue.linear.x += 20;
  }
  
  SendMoveCommand();
}

function slowDown(){
  console.log("Slow Down");
  if (speedValue.linear.x <= 0) {
    speedValue.linear.x = 0;
  } else {
    speedValue.linear.x -= 20;
  }
  SendMoveCommand();
}

var inter = null;

/** Handle the release key event
 * 
 * When released reinitialize the sensibility
 */
var ReleasedKey = {
  "up": function(){
    console.log("Released key: up");
  }
}

/**
* 
* aavancer en RPM
* RPM 0 -> 60
* 
* rotation en degré plus tard -20 -> 20
* remettre à 0 après
*  côté ROS ou HMI ( à voir )
* 
* 
*/
