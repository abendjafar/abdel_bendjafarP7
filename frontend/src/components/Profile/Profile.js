import React from 'react';
import axios from 'axios';
// Import components
import App from "../App";
import Avatar from '../Avatar/Avatar';
import TinyLoader from '../TinyLoader/TinyLoader';

export default class Profile extends React.Component {
    constructor(props) {
      super(props);
      this.state= {
        // DATAS
        userLogged: props.userLogged,
        jobsList: props.jobsList,
        // Inputs
        // [First, Last, Email, Password, Avatar]
        inputValid: [true, true, true, true, true],
        validForm: true,
        valueFirstname: props.userLogged.firstname,
        valueLastname: props.userLogged.lastname,
        valueEmail: props.userLogged.email,
        valuePassword: null,
        fileAvatar: null,
        // Jobs
        curJobId: props.userLogged.job.id,
        curJob: props.userLogged.job.jobs,
        curPosJob: null
      }
      // Url
      this.userUrl = 'http://localhost:8080/api/user';
      this.jobUrl = 'http://localhost:8080/api/jobs';
      // Form control
      this.OnSubmit = this.OnSubmit.bind(this);
      this.OnChange = this.OnChange.bind(this);
      this.deleteAvatar = this.deleteAvatar.bind(this);
      this.delete = this.delete.bind(this);
      // Jobs
      this.OnClickJob = this.OnClickJob.bind(this);
    }
  
    // Gestion d'envoi.
    async OnSubmit(event) {
      const { userLogged, valueFirstname, valueLastname, valueEmail, valuePassword, fileAvatar, curJobId } = this.state;
      // Object contain value forms
      const formData = new FormData();
      formData.append("userId", userLogged.id);
      formData.append("firstname", valueFirstname);
      formData.append("lastname", valueLastname);
      formData.append("jobId", curJobId);
      formData.append("email", valueEmail);
      if(valuePassword != null) formData.append("password", valuePassword);
      if(fileAvatar != null) formData.append("avatar", fileAvatar);
      
      event.preventDefault();
      // Put request.
      await axios.put(this.userUrl+'/'+userLogged.id+'/'+0, formData, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token")
        }
      })
      .then(() => App.ReloadApp())
      .catch(error => {
        console.error('Error Edit Avatar!');
        console.warn(error);
      });
      
    }
  
    // Gestion des events.
    OnChange(event) {
      const myCase = event.target.name;
      switch (myCase) {
        case 'firstname':
          this.checkForm(event.target);
          this.setState({valueFirstname: event.target.value});
          break;
        case 'lastname':
          this.checkForm(event.target);
          this.setState({valueLastname: event.target.value});
          break;
        case 'email':
          this.checkForm(event.target);
          this.setState({valueEmail: event.target.value});
          break;
        case 'password':
          this.checkForm(event.target);
          this.setState({valuePassword: event.target.value});
          break;
        case 'avatar':
          this.checkForm(event.target);
          this.setState({fileAvatar: event.target.files[0]});
          break;
        default:
          console.error('Nothing here!');
          break;
      }
    }
  
    // Contrôle des champs de formulaire.
    checkForm(target) {
      const { inputValid } = this.state;
      const inputName = target.name;
      let inputs = [...inputValid];
      let pos = 0;
      switch (inputName) {
        default:
          console.error('Unknown field name!');
          break;
        case 'firstname':
        case 'lastname':
          if(inputName === 'lastname') pos = 1;
  
          if(target.value.length >= 2 ) {
            // Change style
            target.className = "valid";
            inputs[pos] = true;
            this.setState({ inputValid: inputs });
          }
          else {
            // Change style
            target.className = "error";
            inputs[pos] = false;
            this.setState({ inputValid: inputs });
          }
          break;
        case 'email':
          let regEmail = new RegExp(/^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})/g);
          pos = 2;
          if(!target.value.match(regEmail)) {
            // Change style
            target.className = "error";
            inputs[pos] = false;
            this.setState({ inputValid: inputs });
          }
          else {
            // Change style
            target.className = "valid";
            inputs[pos] = true;
            this.setState({ inputValid: inputs });
          }
          break;
        case 'password':
          pos = 3;
          if(target.value.length >= 4 ) {
            // Change style
            target.className = "valid";
            inputs[pos] = true;
            this.setState({ inputValid: inputs });
          }
          else {
            // Change style
            target.className = "error";
            inputs[pos] = false;
            this.setState({ inputValid: inputs });
          }
          if(target.value.length === 0 ) {
            // Change style
            target.className = "";
            inputs[pos] = true;
            this.setState({ inputValid: inputs });
          };
          break;
        case 'avatar':
          pos = 4;
          if(target.value) {
            // Change style
            target.className = "valid";
            inputs[pos] = true;
            this.setState({ inputValid: inputs });
          }
          else {
            // Change style
            target.className = "";
            inputs[pos] = false;
            this.setState({ inputValid: inputs });
          };
          break;
      }
  
      if(inputs.every(element => element === true))
        this.setState({ validForm: false });
      else
        this.setState({ validForm: true });
    }
  
    // Modification de l'emploi de l'utilisateur.
    async OnClickJob(event) {
      const { jobsList, curPosJob, userLogged } = this.state;
      let posJob = curPosJob+1;
      if(!curPosJob) posJob = 1;
      if(posJob >= jobsList.length) posJob = 0;
  
      jobsList.forEach((job, index) => {
        if(posJob === index) {
          
          if(job.id === userLogged.job.id) {
            event.target.className = "";
            this.setState({ validForm: true });
          }
          else {
            event.target.className = "valid";
            this.setState({ validForm: false });
          }
          this.setState({ 
            curPosJob: posJob,
            curJobId: jobsList[posJob].id,
            curJob: jobsList[posJob].jobs
          });
  
        }
      });
    }
  
    // Suppression de l'avatar.
    async deleteAvatar() {
      const { userLogged } = this.state;
      if(window.confirm('Votre avatar est sur le point d\'être supprimer...\nÊtes vous sûre ?')) {
        // Delete request.
        await axios.delete(this.userUrl+'/'+userLogged.id+'/'+1, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token")
          }
        }).then(() => App.ReloadApp());
      }
    }
  
    // Suppression du compte.
    async delete() {
      const { userLogged } = this.state;
      if(window.confirm('Vous êtes sur le point de supprimer votre compte...\nÊtes vous sûre ?')) {
        // Object contain value forms
        const formData = new FormData();
        formData.append('', userLogged);
        await axios.put(this.userUrl+'/'+userLogged.id+'/'+1, formData, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token")
          }
        })
        .then(() => {
          sessionStorage.clear();
          App.ReloadApp();
        });
      }
    }
  
    render() {
      const { userLogged } = this.state;
      const { isLoading, curJob } = this.state;
      const { validForm, valueFirstname, valueLastname, valueEmail, fileAvatar } = this.state;
      return (<>
  
        <div className='profile'>
          <form onSubmit={this.OnSubmit} disabled={validForm}>
          {!isLoading && userLogged ? <Avatar dataUser={{...userLogged, isProfile: true}} fileAvatar={fileAvatar} OnChange={this.OnChange} deleteAvatar={this.deleteAvatar} /> : <TinyLoader />}
            <div className="names-content">
              <label htmlFor="Prenom">Prénom</label>
                <input id='Prenom' name='firstname' type='text' placeholder='Prénom'
                  value={valueFirstname} onChange={this.OnChange} required />
              
              <label htmlFor="Nom">Nom</label>
                <input id='Nom' name='lastname' type='text' placeholder='Nom'
                  value={valueLastname} onChange={this.OnChange} required />
            </div>
            <label htmlFor="Jobs">emploi</label>
              <input id='Jobs' name='jobs' type='text' readOnly
                label='Emploi' value={curJob} onClick={this.OnClickJob} />
            
            <label htmlFor="Email">email</label>
              <input id='Email' name='email' type='email' placeholder='Ex : example@groupomania.com'
                label='Adresse email' value={valueEmail} onChange={this.OnChange} required />
  
            <h2>Optionnel</h2>
            <label htmlFor="NewPassword">password</label>
              <input id='NewPassword' name='password' type='password' placeholder='Nouveau mot de passe'
               label='Mot de passe' onChange={this.OnChange} />
  
            <input type='submit' disabled={validForm} label='Mettre à jour' value='Mettre à jour' />
          </form>
  
          <h3>Supprimer le compte !</h3>
            <input type='button' onClick={this.delete} label='Delete' value='Supprimer le compte!' />
        </div>
      </>)
    }
}
