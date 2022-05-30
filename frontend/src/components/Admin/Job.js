import React from "react";
import axios from "axios";

export default class Job extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Datas
      isLoading: false,
      userLogged: props.userLogged,
      job: props.job,
      // Jobs
      addJob: false,
      editJob: false,
      isEdited: false,
      // Inputs
      // [Job, Last, Email, Password, Avatar]
      inputValid: [true],
      validForm: true,
      valueJob: props.job.jobs
    };
    this.jobUrl = 'http://localhost:8080/api/jobs';
    // Form control
    this.OnClickEditJob = this.OnClickEditJob.bind(this);
    this.OnDeleteJob = this.OnDeleteJob.bind(this);
    this.OnChange = this.OnChange.bind(this);
  }

  // Afficher/Cacher le formulaire de modification.
  async OnClickEditJob(event) {
    let jobId = event.target.parentNode.value;
    if(!jobId) jobId = event.target.value;

    const { editJob, isEdited, valueJob } = this.state;
    if(editJob) {
      if(isEdited) {
        // Object Contient des formulaires de valeur
        const formData = { job: valueJob };

        // Mettre à jour la demande.
        await axios.put(this.jobUrl+'/'+jobId, formData, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token")
          }
        }).then(() => { 
          this.setState({ editJob: false });
          document.location.reload();
        });
      }
      else this.setState({ editJob: false });
    }
    else {
      this.setState({ editJob: true });
    }
  }
  
  // Suppression d'un emploi.
  async OnDeleteJob(event) {
    let jobId = event.target.parentNode.value;
    if(!jobId) jobId = event.target.value;
    if(window.confirm(`Vous êtes sur le point de supprimer :\n ${jobId}\nÊtes vous sûre ?`)) {
      // Delete request.
      await axios.delete(this.jobUrl+'/'+jobId, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token")
        }
      })
      .then(() => { document.location.reload(); });
    }
  }

  // Gestion des events.
  OnChange(event) {
    const { job } = this.state;
    const myCase = event.target.name;
    switch (myCase) {
      case 'job':
        if(job.jobs !== event.target.value) this.setState({ isEdited: true });
        else this.setState({ isEdited: false });
        this.checkForm(event.target);
        this.setState({valueJob: event.target.value});
        break;
      default:
        console.error('Nothing here!');
        break;
    }
  }

  // Contrôle des champs de formulaire.
  checkForm(target) {
    const inputName = target.name;
    switch (inputName) {
      default:
      case 'job':
        if(target.value.length >= 2 ) {
          // Change style
          target.className = "valid";
        }
        else {
          // Change style
          target.className = "error";
        }
        break;
    }
  }
  
  render() {
    const { isLoading, userLogged, job, editJob, valueJob } = this.state;
    return (<>
      {!isLoading && userLogged && job ? (
        <div className="job" key={'Jobs-'+job.id}>
          {editJob ? (<>

            <label htmlFor="Job">Job</label>
            <input key={job.id} id='Job' name='job' type='text' placeholder="Emploi ?"
              defaultValue={valueJob} onChange={this.OnChange} />
              <div>
                <button className="edit actived" aria-label="editJob" value={job.id} onClick={this.OnClickEditJob}>
                  <i className="fa-solid fa-pen"></i>
                </button>
                {job.id === 1 ? null : (<>
                  <button className="delete" aria-label="delJob" value={job.id} onClick={this.OnDeleteJob}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </>)}
              </div>

          </>) : (<>

            <p>{job.jobs}</p>
            <div>
              <button className="edit" aria-label="editJob" value={job.id} onClick={this.OnClickEditJob}>
                <span className="hidden">edit job</span>
                <i className="fa-solid fa-pen"></i>
              </button>
              {job.id === 1 ? null : (<>
                <button className="delete" aria-label="delJob" value={job.id} onClick={this.OnDeleteJob}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </>)}
            </div>

          </>)}
        </div>
      ) : 'Error to load jobs!'}
      
    </>)
  }
}
