import React from "react";
import axios from "axios";
// Import components
import App from "../App";
import Avatar from "../Avatar/Avatar";

export default class AddForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // DATAS
            userLogged: props.userLogged,
            valueArticle: '',
            fileUpload: null,
            // OPTIONS
            isValid: true,
            isLoading: false
        }
        // Request Url
        this.articleUrl = 'http://localhost:8080/api/articles';
        // OnClick
        this.OnSubmitArticle = this.OnSubmitArticle.bind(this);
        this.OnChange = this.OnChange.bind(this);
    }

    // Gestion de l'envoi.
    OnSubmitArticle(event) {
        const { userLogged, valueArticle, fileUpload } = this.state;
        // Object contain value forms
        const formData = new FormData();
        formData.append("userId", userLogged.id);
        formData.append("article", valueArticle);
        formData.append("image", fileUpload);

        event.preventDefault();
        // Post request.
        axios.post(this.articleUrl, formData, {
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token")
            }
        }).then( () => { App.ReloadApp(); })
        .catch(error => {
            console.error('Error Add Article!');
            console.warn(error);
        });
    }

    // Gestion des events.
    OnChange(event) {
        const myState = event.target.name;
        switch (myState) {
            case 'article':
                if(event.target.value.length) {
                    event.target.className = "valid";
                    this.setState({ isValid: false });
                }
                else {
                    event.target.className = "";
                    this.setState({ isValid: true });
                }
                this.setState({valueArticle: event.target.value});
                break;
            case 'image':
                if(event.target.value) 
                    this.setState({ isValid: false });
                else 
                    this.setState({ isValid: true });
                
                this.setState({fileUpload: event.target.files[0]});
                break;
            default:
                console.error('Nothing here!');
                break;
        }
    }

    render() {
        const { userLogged } = this.state;
        const { isValid, valueArticle } = this.state;
        return (<>
            <form className="addArticle" onSubmit={this.OnSubmitArticle} disabled={isValid}>
              <Avatar key={'avatar-'+userLogged.id} dataUser={{...userLogged, isProfile: false}} />
              <label htmlFor="article">article</label>
              <input id="article" type='text' name="article" placeholder={'Quoi de neuf, '+userLogged.firstname+' ?'}
              value={valueArticle} onChange={this.OnChange} />
              <label htmlFor="image" className="file-upload"><span className="hidden">upload</span><i className="fa-solid fa-image"></i></label>
              <input id="image" name="image" onChange={this.OnChange} type="file" label="UploadImage" accept=".jpg,.jpeg,.png,.gif"></input>
              <button aria-label="sendarticle" disabled={isValid}>
                  <i className="fa-solid fa-paper-plane" alt="sendarticle"></i>
              </button>
              <input type='hidden' name="userId" value={userLogged.id} />
            </form>
        </>)
    }
}