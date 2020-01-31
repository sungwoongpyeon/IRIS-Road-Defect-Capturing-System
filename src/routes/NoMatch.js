import React, {Component} from 'react';
import '../css/NoMatch.css';

class NoMatch extends Component{
  render(){
    return(
      <div className="nomatch-container">
           <p className="nomatch-desc">
             404 Error Page Not Found
           </p>
        </div>
    );
  }
}

export default NoMatch;
