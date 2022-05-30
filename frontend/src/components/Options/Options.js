import React from "react";
// Import components
import App from "../App";
import TinyLoader from "../TinyLoader/TinyLoader";
// Import styles
import "./Options.css";

export default class Options extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // DATAS
      userLogged: props.userLogged,
      optionsFor: props.for,
      commentId: props.commentId,
      // OPTIONS
      isLoading: false                   // Active for all get request
    }
    this.logout = this.logout.bind(this);
  }

  logout() {
    if(window.confirm('Vous allez être déconnecté...\nÊtes vous sûre ?')) {
      sessionStorage.clear();
      App.ReloadApp();
    }
  }

  setOptions() {
    const { optionsFor, commentId, userLogged } = this.state;
    switch (optionsFor) {
      case 'Avatar':
        return (<>
          <ul className="options article">
              <li className="edit" id={"Profile"} onClick={this.props.navigateTo}>
                <i className="fa-solid fa-user"></i> Mon Compte
              </li>
              {userLogged.isAdmin ? (<>
                <li className="edit middle" id={"Admin"} onClick={this.props.navigateTo}>
                  <i className="fa-solid fa-screwdriver-wrench"></i> Administration
                </li>
              </>) : null}
              <li className="delete" onClick={this.props.logout}>
                <i className="fa-solid fa-right-from-bracket"></i> Déconnexion
              </li>
          </ul>
        </>);
      default:
        return (<>
          <ul className="options article">
              <li className="edit" onClick={this.props.onEditClick}>
                <i className="fa-solid fa-pencil"></i> Modifier
              </li>
              {commentId ? (<>
                <li className="delete" value={commentId} onClick={this.props.onDeleteClick}>
                  <i className="fa-solid fa-trash"></i> Supprimer
                </li>
              </>) : (<>
                <li className="delete" onClick={this.props.onDeleteClick}>
                  <i className="fa-solid fa-trash"></i> Supprimer
                </li>
              </>)}
          </ul>
        </>);
    }
  }

  render() {
    const { isLoading } = this.state;
    return (<>
      {!isLoading ? this.setOptions() : (<ul className="options article"><TinyLoader /></ul>)}
    </>)
  }
}
