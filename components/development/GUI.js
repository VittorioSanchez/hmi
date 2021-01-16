
/* This page will contain the standard React elements */

'use strict';

const e = React.createElement;


//React elements
//ReadOnlyField, this component will render each simple variables (value, boolean, etc...)
class ReadOnlyField extends React.Component{
    render(){
        var otherClasses = "";

        switch (this.props.type) {
            case "value":
                return (<div className={`readOnly field ${this.props.type} ${otherClasses}`}>{this.props.children} {this.renderValue()}</div>)
                break;
            case "boolean":
                otherClasses += this.props.value;
                return (<div className={`readOnly field ${this.props.type} ${otherClasses}`}>{this.props.children} {this.renderValue()}</div>)
                break;
            case "array":
                return (<div className={`readOnly field ${this.props.type} ${otherClasses}`}>{this.props.children} {this.renderArray()}</div>)
                break;
            default:
                break;
        }
    }

    renderValue(){
        return <div>{this.props.value}</div>;
    }
    renderArray(){
        return this.props.value.map((detection) => <li>{detection}</li>);
        
    }
}

class Separator extends React.Component{
    render(){
        if (this.props.children != "") {
            
        } else {
            
        }
        return "Nope"
    }
}

class Block extends React.Component{
    constructor(props){
        super(props);
        this.className = "block";
        //Define if the object is in a tab
        this.tabbed = (props.tabbed == "true");
    }

    render(){
        //Avoid container if the element is in a tab
        if(this.tabbed)
         return this.renderContent();

        //Draw a container if the element is not in a tab
        return (
            <div className={this.className} id={this.props.id}>
                <h2>{this.props.name}</h2>
                <div>{this.renderContent()}</div>
            </div>
        );
    }
    
    //Content of the block
    renderContent(){
        return this.props.children;
    }
}

class VideoBlock extends Block{
    constructor(props){
        super(props);

        this.toggleFullscreen = this.toggleFullscreen.bind(this);
        this.fullscreen = false;
        this.className = "video "+this.className;
    }

    toggleFullscreen(event){
        this.fullscreen = (this.fullscreen) ? false : true;
        let elem = event.target;

        if (this.fullscreen) {

            if (elem.requestFullscreen) {
                elem.requestFullscreen();
              } else if (elem.webkitRequestFullscreen) { 
                elem.webkitRequestFullscreen();
              } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        }else{
            document.exitFullscreen();
        }
    }

    //Content of the video block
    renderContent(){
        return  (<div>
        <small>Server Address: {LOCALHOST}</small>
                <img id="video_flow" src={this.props.url} title="Click to show in fullscreen" onClick={this.toggleFullscreen}>
                </img>
        </div>);
    }
}

class Tab extends Block{
    constructor(props){
        super(props);

        //  Set these values if the property is available
        //Choose the first element selected by reading the selected property
        this.selected = (props.selected == undefined)? 0 : props.selected;
        this.tabPosition = (props.position == undefined)? "top" : props.position;
        //Ensure that the value cannot be an unexpected value
        if(["top","bottom"].indexOf(this.tabPosition) == -1){
            this.tabPosition = "bottom";
        }

        this.setSelected = this.setSelected.bind(this);
    }

    isSelected(item){
        this.itemNumber++;
        let classAttribute = (item == this.props.children[this.selected])?
                                    "selected" : "";
        return classAttribute;
    }

    setSelected(number){
       this.selected = number.target.id;
       //console.log(number.target.id);
    }

    getTabs(side){
        if(side != this.tabPosition){
            return "";
        }
        //Utiliser du React pur
        let list = this.props.children;   
        this.itemNumber = -1;
        let tabs = <ul className="tab">{list.map((item)=>(
                        <li className={this.isSelected(item)} id={this.itemNumber} key={item.props.id} onClick={this.setSelected}>
                            {item.props.name}
                        </li>)
                        )}
                    </ul>;

        return tabs;
    }

    renderContent(){
        if(this.props.children.length > 1){
            let content = ( <div>                
                    {this.getTabs("top")}
                    {this.props.children[this.selected]}
                    {this.getTabs("bottom")}
                </div>
                );

            return content;
        }
        return this.props.children;
    }
}

class DashBoard extends React.Component{
    constructor(props){
        super(props);
        
        //This Object will contain all the data
        this.state = {
            "refreshed": 0,
            "speedValue":{
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
            }
        }


        //Launch the communication code
        //Forced refreshment, to be improved !!!
        window.setInterval(function(){
            var state = this.state;
            state.refreshed = (state.refreshed + 1) % 10;

            //Send instruction periodically
            if(speedValue.linear.x >0){
                SendMoveCommand();
            }

            //Updating
            this.setState(state);
        }.bind(this),500);
    }

    render(){
        return (<div><h4>Dashboard</h4><div className="content">
            <VideoBlock id="ai-video" name="Live Streaming" url={`http://${LOCALHOST}:${8080}/stream?topic=/detection_node/image&type=ros_compressed`}></VideoBlock>

            <VideoBlock id="rviz" name="LiDAR" url={`http://${LOCALHOST}:${8080}/stream?topic=/raspicam_node/image&type=ros_compressed`}></VideoBlock>

            <Block name="Latest detections" id="detections">
                <ReadOnlyField 
                        name="latest_detection" 
                        type="array" 
                        value={detection_string_array}>
                </ReadOnlyField>
            </Block>

            <Block name="Emergency" id="emergency">
                <button className="emergency" onClick={StopVehicle}>Stop vehicle</button>
                <button onClick={MoveForward}>Move Forward</button>
            </Block>
            <Block name="Controls" id="controls">
                <ReadOnlyField 
                    name="speed_desired" 
                    type="value" 
                    value={speedValue.linear.x}>
                        Speed
                </ReadOnlyField>
                    <button className="up" onClick={MoveForward}>S</button>
                    <ReadOnlyField 
                    name="angle" 
                    type="value" 
                    value={NaN}>
                        Angle
                </ReadOnlyField>
                    <button className="left" onClick={TurnLeft}>R</button>
                    <button className="down" onClick={slowDown}>T</button>
                    <button className="right" onClick={TurnRight}>Q</button>
            </Block>
            <Block name="State" id="block1">
                <ReadOnlyField 
                    name="first_field" 
                    type="value" 
                    value={Bat_mes}>
                        Batterie level
                </ReadOnlyField>
            </Block>
            <Block name="Velocity" id="block2">
                <ReadOnlyField 
                    name="first_field" 
                    type="value" 
                    value={VMG_mes}>
                        Left wheel speed
                </ReadOnlyField>
                <ReadOnlyField 
                    name="first_field" 
                    type="value" 
                    value={VMD_mes}>
                        Right wheel speed
                </ReadOnlyField>
            </Block>
            <Block name="Trajectory" id="trajectory">
                <GMap></GMap>
            </Block>
            </div></div>);
    }
}



/*

    <div id="map"></div>
                <input onClick={doNothing} type="button" value="Remove line"></input>
                <input onClick={doNothing} type="button" value="Add line"></input>
*/
function doNothing(){
    console.log("This function isn't developed or connected yet");
}

function ShowWarning(){

}

function ShowAlert(){
    
}

//Show a Dashboard
const domContainer = document.querySelector('#dashboard');
ReactDOM.render( <DashBoard /> , domContainer);
