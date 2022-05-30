import React from "react";
// Import components
import Options from "../Options/Options";
import TinyLoader from "../TinyLoader/TinyLoader";
// Import styles
import "./Avatar.css";

export default class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // DATAS
      dataUser: props.dataUser,
      // OPTIONS
      isLoading: false,                   //Actif pour tous les demandes
      isClickable: props.isClickable,     // Options activées
      isClicked: false,                   // ouvrir/fermer le menu options
      isProfile: props.dataUser.isProfile // Show Avatar for Profile or not
    }
    this.OnClick = this.OnClick.bind(this);
  }

  componentDidMount() {
    const { dataUser } = this.state;
    if (!dataUser) this.setState({ isClickable: false });
  }

  OnClick() {
    const { isClicked } = this.state;
    if (isClicked) this.setState({ isClicked: false });
    else this.setState({ isClicked: true });
  }

  setAvatar() {
    const { dataUser } = this.state;
    if (dataUser && dataUser.avatar !== 'none')
      return (<><img src={dataUser.avatar} alt="Avatar" /></>);
    else return (<><i className="fa-solid fa-user"></i></>);
  }

  render() {
    const { isLoading, isClickable, isClicked, isProfile } = this.state;
    const { dataUser } = this.state;
    return (<>
      {!isLoading ? (<>
        {isClickable ? (<>

          <div className="avatar clickable" onClick={this.OnClick}>
            {this.setAvatar()}
            {isClicked ? (<>
              <Options for='Avatar' userLogged={dataUser} navigateTo={this.props.navigateTo} logout={this.props.logout} />
            </>) : null}
          </div>

        </>) : (<>
          {isProfile ? (<>
            <div className="avatar-profile">
              {this.setAvatar()}
              <div className="avatar-options">
                <label htmlFor="avatar" onChange={this.props.OnChange}>
                  <span className="hidden">avatar</span>
                  {this.props.fileAvatar ? <i className="fa-solid fa-xmark"></i> : (<>
                    <i className="fa-solid fa-upload"></i>
                  </>)}
                </label>
                <input id="avatar" name='avatar' type='file' accept=".jpg,.jpeg,.png,.gif" onChange={this.props.OnChange} />

                {dataUser.avatar !== 'none' ? (
                  <div className="delete" onClick={this.props.deleteAvatar}>
                    <i className="fa-solid fa-trash" alt="deleteAvatar"></i>
                  </div>) : null}

              </div>
            </div>
          </>) : (<>
            <div className="avatar">{this.setAvatar()}</div>
          </>)}
        </>)}
      </>) : (<div className="avatar"><TinyLoader /></div>)}
    </>)
  }
}
