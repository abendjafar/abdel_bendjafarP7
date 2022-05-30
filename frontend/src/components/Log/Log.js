import React from "react";
import axios from "axios";
// Import componement
import App from "../App";
import TinyLoader from "../TinyLoader/TinyLoader";
// Import styles
import "./Log.css";

export default class Log extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        // DATAS
        // OPTIONS
        isLoading: false,                   // Active for all get request
        curPage: 'Login'
      }
      this.navigateTo = this.navigateTo.bind(this);
    }

    // Modification de la page à afficher.
    navigateTo(event) {
        const myPage = event.target.value;
        this.setState({ curPage: myPage });
    }

    // Mise en place du composant selon la page actuelle. (curPage)
    setComponent() {
        const { curPage } = this.state;
        switch (curPage) {
            case 'Login':
                return (<><Login navigateTo={this.navigateTo} /></>);
            case 'Register':
                return (<><Register navigateTo={this.navigateTo} /></>);
            default:
            break;
        }
    }

    render() {
        const { isLoading } = this.state;
        return (<>

        {!isLoading ? (<>
            {this.setComponent()}
        </>) : ( <TinyLoader /> )}

        </>)
    }
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // VALUE INPUTS
      valueEmail: '',
      valuePassword: '',
      // FORM VALID
      // [Email, Password]
      inputValid: [false, false],
      validForm: true,
      // OPTIONS
      isLoading: false,                   // Active for all get request
      inAction: false,                    // Active if request post/get
      // ERROR
      error: ''
    }
    this.userUrl = 'http://localhost:8080/api/user';
    this.authUrl = 'http://localhost:8080/api/auth/login';
    // OnClick
    this.postLogin = this.postLogin.bind(this);
    this.OnChange = this.OnChange.bind(this);
  }

  // Requête d'authentification.
  async postLogin(event) {
    event.preventDefault();
    this.setState({ validForm: true, inAction: true, error: '' });
    const { valueEmail, valuePassword } = this.state;
    const dataPost = {
      email: valueEmail,
      password: valuePassword
    };

    // Post request.
    await axios.post(this.authUrl, dataPost).then((res) => {
      this.setToken(res.data.token);

      const getUserUrl = this.userUrl+'?id='+res.data.userId;
      axios.get(getUserUrl).then((user) => {
        this.setState({ userLogged: user.data.user, inAction: false, curPage: 'Home' });
        App.ReloadApp();
      })
      .catch((error) => {
        console.warn('ERROR');
        this.setState({ userLogged: null, validForm: false, inAction: false, error: 'Erreur interne!' });
      });
    })
    .catch((err) => {
      console.error('Error Login request!');
      console.log(err.reason);
      this.setState({ userLogged: null, validForm: false, inAction: false, error: 'Adresse Email / Mot de passe incorrect!' });
    });
  }

  // Pour tout changement apporter aux inputs.
  OnChange(event) {
    const myCase = event.target.name;
    switch (myCase) {
      case 'email':
        this.checkForm(event.target);
        this.setState({valueEmail: event.target.value});
        break;
      case 'password':
        this.checkForm(event.target);
        this.setState({valuePassword: event.target.value});
        break;
      default:
        console.error('Nothing here!');
        break;
    }
  }

  // Verification des inputs valides.
  checkForm(target) {
    const { inputValid } = this.state;
    const inputName = target.name;
    let inputs = [...inputValid];
    let pos = 0;
    switch (inputName) {
      default:
        console.error('Unknown field name!');
        break;
      case 'email':
        let regEmail = new RegExp(/^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})/g);
        pos = 0;
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
        pos = 1;
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
    }

    if(inputs.every(element => element === true))
      this.setState({ validForm: false });
    else
      this.setState({ validForm: true });
  }

  // Insertion du jeton dans la session.
  setToken(userToken) {
    sessionStorage.setItem('token', JSON.stringify(userToken));
  }

  render() {
    const { isLoading, validForm, inAction, error } = this.state;
    return (<>

    {!isLoading ? (<>
        <div className='login'>
            <h2><i className='fa-solid fa-user-secret'></i> Connectez-vous !</h2>
            {error || error !== '' ? <p className="error">{error}</p> : null}
            {inAction ? <TinyLoader /> : null}
            <form onSubmit={this.postLogin} disabled={validForm}>
                <label htmlFor="Email">Email</label>
                <input id="Email" name='email' type='email' placeholder='Ex : example@groupomania.com'
                onChange={this.OnChange} label='Adresse email' required />
                <label htmlFor="Password">Mot de passe</label>
                <input id="Password" name='password' type='password' placeholder='mot de passe'
                onChange={this.OnChange} label='Mot de passe' required />
                <input type='submit' disabled={validForm} label='Connexion' value='Connexion' />
            </form>
        </div>

        <div className="sign">
            <h3>Vous n'êtes pas encore membre ?</h3>
            <button value={'Register'} onClick={this.props.navigateTo} >Inscription</button>
        </div>
    </>) : (<TinyLoader />)}

    </>)
  }
}

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // VALUE INPUTS
      valueFirst: '',
      valueLast: '',
      valueEmail: '',
      valuePassword: '',
      // FORM VALID
      // [First, Last, Email, Password]
      inputValid: [false, false, false, false],
      validForm: true,
      // OPTIONS
      isLoading: false,                   // Active for all get request
      inAction: false,                    // Active if request post/get
      // ERROR
      error: ''
    }
    this.userUrl = 'http://localhost:8080/api/user';
    this.signUrl = 'http://localhost:8080/api/auth/sign';
    // OnClick
    this.postLogin = this.postLogin.bind(this);
    this.OnChange = this.OnChange.bind(this);
  }

  // Requête d'inscription.
  async postLogin(event) {
    event.preventDefault();
    this.setState({ validForm: true, inAction: true });
    const { valueFirst, valueLast, valueEmail, valuePassword } = this.state;
    const dataPost = {
      firstname: valueFirst,
      lastname: valueLast,
      email: valueEmail,
      password: valuePassword
    };

    // Post request.
    await axios.post(this.signUrl, dataPost).then((res) => {
      this.setToken(res.data.token);

      const getUserUrl = this.userUrl+'?id='+res.data.userId;
      axios.get(getUserUrl).then((user) => {
        this.setState({ userLogged: user.data.user, inAction: false, curPage: 'Home' });
        App.ReloadApp();
      })
      .catch((error) => {
        console.warn('ERROR');
        this.setState({ userLogged: null, validForm: false, inAction: false, error: 'Erreur interne!' });
      });
    })
    .catch((err) => {
      console.error('Error Login request!');
      console.log(err);
      this.setState({ userLogged: null, validForm: false, inAction: false, error: 'Adresse Email déjà existante!' });
    });
  }

  // Pour tout changement apporter aux inputs.
  OnChange(event) {
    const myCase = event.target.name;
    switch (myCase) {
      case 'firstname':
        this.checkForm(event.target);
        this.setState({valueFirst: event.target.value});
        break;
      case 'lastname':
        this.checkForm(event.target);
        this.setState({valueLast: event.target.value});
        break;
      case 'email':
        this.checkForm(event.target);
        this.setState({valueEmail: event.target.value});
        break;
      case 'password':
        this.checkForm(event.target);
        this.setState({valuePassword: event.target.value});
        break;
      default:
        console.error('Nothing here!');
        break;
    }
  }

  // Verification des inputs valides.
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
        pos = 0;
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
    }

    if(inputs.every(element => element === true))
      this.setState({ validForm: false });
    else
      this.setState({ validForm: true });
  }

  // Insertion du jeton dans la session.
  setToken(userToken) {
    sessionStorage.setItem('token', JSON.stringify(userToken));
  }

  render() {
    const { isLoading, validForm, inAction, error } = this.state;
    return (<>

    {!isLoading ? (<>
      <div className='login'>
        <h2><i className='fa-solid fa-file-signature'></i> Inscrivez-vous !</h2>
        {error || error !== '' ? <p className="error">{error}</p> : null}
        {inAction ? <TinyLoader /> : null}
        <form onSubmit={this.postLogin} disabled={validForm}>
          <label htmlFor="Prenom">Prénom</label>
          <input id='Prenom' name='firstname' type='text' placeholder='Prénom'
            label='Prénom' onChange={this.OnChange} required />
          
          <label htmlFor="Nom">Nom</label>
          <input id='Nom' name='lastname' type='text' placeholder='Nom'
            label='Nom' onChange={this.OnChange} required />
        
          <label htmlFor="Email">Email</label>
          <input id='Email' name='email' type='email' placeholder='Ex : example@groupomania.com'
            label='Adresse email' onChange={this.OnChange} required />
          
          <label htmlFor="Password">Mot de passe</label>
          <input id='Password' name='password' type='password' placeholder='mot de passe'
            label='Mot de passe' onChange={this.OnChange} required />
          <input type='submit' disabled={validForm} label='Inscription' value='Inscription' />
        </form>
      </div>

      <div className="sign">
        <h3>Vous êtes déjà membre ?</h3>
        <button value={'Login'} onClick={this.props.navigateTo} >Connexion</button>
      </div>
    </>) : (<TinyLoader />)}

  </>)
  }
}
