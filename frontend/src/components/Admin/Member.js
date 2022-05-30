import React from "react";
import axios from "axios";
// Import components.
import App from "../App";
import Avatar from "../Avatar/Avatar";

export default class Member extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Datas
      isLoading: false,
      userLogged: props.userLogged,
      member: props.member,
    };
    this.userUrl = 'http://localhost:8080/api/user';
    // Form control
    this.OnSetAdmin = this.OnSetAdmin.bind(this);
    this.OnDeleteUser = this.OnDeleteUser.bind(this);
  }

  // Suppression d'un utilisateur.
  async OnDeleteUser() {
    const { member } = this.state;
    if(window.confirm(`Vous êtes sur le point de supprimer définitivement le compte de :\n${member.id} - ${member.firstname} ${member.lastname}\nÊtes vous sûre ?`)) {
      // On lui accorde les droits.
      await axios.delete(this.userUrl+'/'+member.id+'/'+0, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token")
        }
      }).then(() => App.ReloadApp());
    }
  }

  // Attribution/Retrait des droits d'administrations.
  async OnSetAdmin() {
    const { member } = this.state;
    // Si le membre est deja admin
    if(member.isAdmin) {
      let newData = {...member, isAdmin: 0};
      if(window.confirm(`Vous êtes sur le point de retirer les droits à :\n${member.firstname} ${member.lastname}\nÊtes vous sûre ?`)) {
        // On lui retire les droits.
        await axios.put(this.userUrl+'/'+member.id+'/'+0, newData, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token")
          }
        }).then(() => App.ReloadApp());
      }
    }
    // Sinon
    else {
      let newData = {...member, isAdmin: 1};
      if(window.confirm(`Vous êtes sur le point d'accorder les droits à :\n${member.firstname} ${member.lastname}\nÊtes vous sûre ?`)) {
        // On lui accorde les droits.
        await axios.put(this.userUrl+'/'+member.id+'/'+0, newData, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token")
          }
        }).then(() => App.ReloadApp());
      }
    }

  }

  render() {
    const { isLoading, userLogged, member } = this.state;
    return (<>
      {!isLoading && userLogged && member ? (
        <div className="member" key={'Member-'+member.id}>
          <Avatar key={member.id} dataUser={{...member, isProfile: false}} />
          <p>{member.firstname} {member.lastname}</p>
          <div>

          {!member.isDelete ? (<>

            {member.id === 1 ? (<>
              <button className="edit actived" disabled={member.isAdmin} aria-label="editAdmin" value={member.id}>
                <i className="fa-solid fa-shield"></i>
              </button>
            </>) : (<>
              {member.isAdmin ? (<>
                <button className="edit actived" aria-label="editAdmin" onClick={this.OnSetAdmin} >
                  <i className="fa-solid fa-shield"></i>
                </button>
              </>) : (<>
                <button className="edit" aria-label="editAdmin" onClick={this.OnSetAdmin} >
                  <i className="fa-solid fa-shield"></i>
                </button>
              </>)}
              <button className="delete" aria-label="delUser" onClick={this.OnDeleteUser} >
                <i className="fa-solid fa-trash"></i>
              </button>
            </>)}

          </>) : (<>
              <button className="delete" aria-label="delUser" onClick={this.OnDeleteUser} >
                <i className="fa-solid fa-trash"></i>
              </button>
          </>)}
            

          </div>
        </div>
      ) : 'Error to load member!'}
    </>)
  }
}
