
var Vol_mes = 0;
var Bat_mes = 0;
var VMG_mes = 0;
var VMD_mes = 0;
var detection_number = 0;
var detection_string_array = new Array();

window.onload = function(){

      // Suscribing a Topic
      // ------------------
    var listener = new ROSLIB.Topic({
        ros : ros,
        name : '/motor_sensors',
        messageType : 'std_msgs/Float32MultiArray'
    });
    
    // We create a listener to the detection topic
    var listener_detection = new ROSLIB.Topic({
        ros : ros,
        name : '/detection',
        messageType : 'std_msgs/UInt8'
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

    // We use the detection listener to process a published message on 
    listener_detection.subscribe(function(message) {
        let displayLimit = 5;
        detection_number= message.data;
        
        // If detection == 0 then nothing is detected
        if (detection_number != 0){ //something is detected
            
            //We update the latest value of detection_string_array
            //Add detected object on the top of the array list
            switch (detection_number){
                case 1:
                    detection_string_array.unshift('Person');
                    break;
                case 2:
                    detection_string_array.unshift('Baggage');
                    break;
                case 3:
                    detection_string_array.unshift('Ball');
                    break;
                case 4:
                    detection_string_array.unshift('Bicycle');
                    break;
                case 5:
                    detection_string_array.unshift('Bus');
                    break;
                case 6:
                    detection_string_array.unshift('Car');
                    break;  
                case 7:
                    detection_string_array.unshift('Cat');
                    break;  
                case 8:
                    detection_string_array.unshift('Dog');
                    break;  
                case 9:
                    detection_string_array.unshift('Motorcycle');
                    break;  
                default: null;
            }      
        }

        //We limit the number of displayed items;
        detection_number.slice(0,displayLimit);
    });
	
};