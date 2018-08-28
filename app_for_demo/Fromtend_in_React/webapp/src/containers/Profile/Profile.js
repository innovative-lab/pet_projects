import {Component} from 'react';
import ProfileTemplate from './Profile.jsx';


class Profile extends Component{
    render(){
        var template  = ProfileTemplate(this);
        return template
    }
}

export default Profile;