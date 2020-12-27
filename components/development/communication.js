
var Vol_mes = 0;
var Bat_mes = 0;
var VMG_mes = 0;
var VMD_mes = 0;

window.onload = function(){
      // Suscribing a Topic
      // ------------------
    var listener = new ROSLIB.Topic({
        ros : ros,
        name : '/motor_sensors',
        messageType : 'std_msgs/Float32MultiArray'
    });


    listener.subscribe(function(message) {
        Vol_mes= message.data[0].toFixed(2);
        Bat_mes= message.data[1].toFixed(2);
        VMG_mes= message.data[2].toFixed(2);
        VMD_mes= message.data[3].toFixed(2);

        /*
        if(document.getElementById("speed_Lwheel") != null){
        document.getElementById("speed_Lwheel").innerHTML = VMG_mes;
        }
        if(document.getElementById("speed_Rwheel") != null){
        document.getElementById("speed_Rwheel").innerHTML = VMD_mes;
        }
        if(document.getElementById("bat_level") != null){
        document.getElementById("bat_level").innerHTML = Bat_mes.toFixed(2);
        }*/
    });
	
};
