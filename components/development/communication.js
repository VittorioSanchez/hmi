
var Vol_mes = 0;
var Bat_mes = 0;
var VMG_mes = 0;
var VMD_mes = 0;
var detection_number = 0;
var detection_string_array = ['nothing', 'nothing', 'nothing', 'nothing', 'nothing'];

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
    listener.subscribe(function(message) {
        detection_number= message.data;
        
        // If detection == 0 then nothing is detected
        if (detection_number != 0){ //something is detected
            
            // We update the detection_string_array by shifting values
            for (let i = 4; i > 0; i--) { 
                detection_string_array[i] = detection_string_array[i-1];
            }
            
            //We update the latest value of detection_string_array
            switch (detection_number){
                case 1:
                    detection_string_array[0] = 'Person';
                    break;
                case 2:
                    detection_string_array[0] = 'Baggage';
                    break;
                case 3:
                    detection_string_array[0] = 'Ball';
                    break;
                case 4:
                    detection_string_array[0] = 'Bicycle';
                    break;
                case 5:
                    detection_string_array[0] = 'Bus';
                    break;
                case 6:
                    detection_string_array[0] = 'Car';
                    break;  
                case 7:
                    detection_string_array[0] = 'Cat';
                    break;  
                case 8:
                    detection_string_array[0] = 'Dog';
                    break;  
                case 9:
                    detection_string_array[0] = 'Motorcycle';
                    break;  
                default: null;
            }      
        }
    });
	
};
