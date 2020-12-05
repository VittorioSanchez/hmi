'use strict';

const e = React.createElement;

//React elements
//SimpleField, this component will render each simple variables (value, boolean, etc...)
class SimpleField extends React.component{
    render(){
        //to add
        /*
        this.props = {
            modifiable

        }
        */
    }
}

class Block extends React.component{
    render(){

    }
}

class DashBoard extends React.component{
    constructor(props){
        super(props);
    }

    render(){
        return e("div",{className:"dashboard"},"Dashboard");
    }
}

function Indicator(props){
    message = props.number;
    
    message += 'Hello World';
    return e('p',null,message);
}

//Show a Dashboard
const domContainer = document.querySelector('#dashboard');
ReactDOM.render(e(Indicator), domContainer);