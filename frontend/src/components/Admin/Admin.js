import React from "react";
import axios from "axios";
// Importer des composants.
import App from "../App";
import Job from "./Job";
import Member from "./Member";

export default class Admin extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        // DATAS
        userLogged: props.userLogged,
        jobsList: props.jobsList,
        // Jobs
        addJob: false,
        editJob: false,
        isEdited: false,
        // Inputs
        // [Job, Last, Email, Password, Avatar]
        inputValid: [false],
        validForm: true,
        valueJob: '',
        valueSearch: '',
        searchResult: null,
        // OPTIONS
        isLoading: false
      }
      // Url
      this.userUrl = 'http://localhost:8080/api/user';
      this.jobUrl = 'http://localhost:8080/api/jobs';
      // Form control
      this.OnClickAddJob = this.OnClickAddJob.bind(this);
      this.OnAddJob = this.OnAddJob.bind(this);
      this.OnChange = this.OnChange.bind(this);
    }
  
    // Afficher/Cacher le formulaire d'ajout.
    OnClickAddJob() {
      const { addJob } = this.state;
      if(addJob) this.setState({ addJob: false });
      else this.setState({ addJob: true });
    }
  
    // Création de l'emploi.
    async OnAddJob(event) {
      const { valueJob } = this.state;
      // Object contain value forms
      const formData = { newJob: valueJob };
      
      event.preventDefault();
      // Post request.
      await axios.post(this.jobUrl, formData, {
        headers: {
          'Authorization': "Bearer " + sessionStorage.getItem("token")
        }
      })
      .then(() => App.ReloadApp())
      .catch(error => {
        console.error('Error Add Job!');
        console.warn(error);
      });
    }
  
    // Gestion des events.
    OnChange(event) {
      const myCase = event.target.name;
      switch (myCase) {
        case 'job':
          this.checkForm(event.target);
          this.setState({valueJob: event.target.value});
          break;
        case 'search':
          this.checkForm(event.target);
          this.setState({valueSearch: event.target.value});
          break;
        default:
          console.error('Nothing here!');
          break;
      }
    }
  
    // Contrôle des champs de formulaire.
    checkForm(target) {
      const { inputValid, valueSearch } = this.state;
      const inputName = target.name;
      let inputs = [...inputValid];
      let pos = 0;
      switch (inputName) {
        default:
        case 'job':
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
        case 'search':
          if(target.value.length >= 2 ) {
            // Search in DB where firstname/Lastname
            axios.get(this.userUrl+'/search?search='+valueSearch)
            .then((res) => {
              this.setState({ searchResult: res.data.users });
              // Change style
              target.className = "valid";
            })
            .catch(error => {
              this.setState({ searchResult: null });
              // Change style
              target.className = "error";
              console.error('Error Search User!');
              console.warn(error);
            });
            // Change style by default
            target.className = "";
          }
          else if(target.value.length === 0) {
            // Change style by default
            target.className = "";
            this.setState({ searchResult: null });
          }
          else {
            // Change style
            target.className = "error";
            this.setState({ searchResult: null });
          }
          break;
      }
  
      if(inputs.every(element => element === true))
        this.setState({ validForm: false });
      else
        this.setState({ validForm: true });
    }
    
    render() {
      const { isLoading, userLogged, jobsList, addJob, valueJob, validForm } = this.state;
      const { valueSearch, searchResult } = this.state;
      return (<>
  
        {!isLoading && userLogged ? (<>
          <div className="admin-panel">
            <h2><i className="fa-solid fa-screwdriver-wrench"></i> Panneau d'administration</h2>
  
            <h3><i className="fa-solid fa-user"></i> Gestion des utilisateurs</h3>
            <label htmlFor="Search">Rechercher</label>
            <input key={'member'} id="Search" type='text' name='search' label='search'
              placeholder="Rechercher un membre..." value={valueSearch} onChange={this.OnChange} />
            
            {valueSearch ? (<>
              <h3>Membres trouvés :</h3>
              <div className="members-result">
              {searchResult ? searchResult.map( (user) => (<>
                  <Member key={'member-'+user.id} userLogged={userLogged} member={user} />
              </>)) : (<>Aucun résultat</>) }
              </div>
            
  
            </>) : null }
  
            <h3><i className="fa-solid fa-building"></i> Gestion des emplois</h3>
            <button onClick={this.OnClickAddJob} aria-label='add' ><i className="fa-solid fa-plus"></i> </button>
  
            {addJob ? <form onSubmit={this.OnAddJob} disabled={validForm} >
              <label htmlFor="Job">Nouvel emploi</label>
              <input id='Job' name='job' type='text' placeholder="Emploi ?"
                value={valueJob} onChange={this.OnChange} />
              <button type='submit' disabled={validForm} aria-label="sendJob">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form> : null}
  
            {jobsList ? jobsList.map((job, index) => (
              <Job key={index} userLogged={userLogged} job={job} />
            )) : 'Aucun emploi trouvé!'}
          </div>
        </>) : 'Error to load Admin Panel!'}
        
      </>)
    }
}
