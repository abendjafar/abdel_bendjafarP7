import React from "react";
// Import components
// Import styles
import "./Loader.css"
// Import image
import Logo from "./../../assets/logoMobile.png";

export default class Loader extends React.Component {
  render() {
    return (<>
      <div className='app-loading'>
        <div className='app-loading-content'>
          <img src={Logo} alt='Groupomania-Logo' />
          Loading
        </div>
      </div>
    </>)
  }
}
