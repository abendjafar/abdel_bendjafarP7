import React from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
// Import components
import Header from "./Header/Header";
import Log from "./Log/Log";
import Home from "./Home/Home";
import Loader from "./Loader/Loader";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // DATAS
      isLoading: false,
      articles: null,
      // LOG
      isLogged: false,
      userLogged: props.dataUser,
      // NAV
      curPage: props.curPage,
      // ERROR
      error: ''
    }
    this.userUrl = 'http://localhost:8080/api/user';
    this.articlesUrl = 'http://localhost:8080/api/articles';
    this.token = sessionStorage.getItem('token');
    // DEBUG
    console.warn('Enter APP');
  }

  componentDidMount() {
    const { articles, curPage } = this.state;
    if(!articles || curPage === 'Home' ) this.getArticles();
  }

  // Récupération des articles.
  getArticles() {
    this.setState({ isLoading: false });
    const { isLogged, userLogged } = this.state;
    console.log('[INFO] Loading articles...');
    axios.get(this.articlesUrl).then( (res) => {
        if(res.status === 204) this.setState({ articles: 0 });
        else this.setState({ articles: res.data.articles });
        console.warn('[SUCCESS] Articles loaded!');
        if(!isLogged || !userLogged) this.checkLog();
    })
    .catch( (err) => {
        console.error('[ERROR] Loading articles error!');
        console.log(err);
        this.setState({ isLoading: false, error: 'Une erreur est survenue! Réessayer plus tard.' });
    });
  }

  // Vérification du jeton +
  // Récupération des informations de l'utilisateur.
  checkLog() {
    const { userLogged } = this.state;
    console.log('[INFO] Checking token...');
    if(this.token) {
      console.warn('[SUCCESS] Token found!');
      console.log('[INFO] Checking User infos...');
      if(!userLogged) {
        console.warn('[ERROR] User infos not found!');
        //Vérifier ici le jeton avec JWT
        const decodedToken = jwt_decode(this.token, 'RANDOM_TOKEN_SECRET');
        if(decodedToken && decodedToken.userId) {
          console.log('[INFO] Get User infos with token...');
          const getUserUrl = this.userUrl+'?id='+decodedToken.userId;
          axios.get(getUserUrl).then((user) => {
            console.warn('[SUCCESS] User infos with token found!');
            this.setState({ curPage: 'Home', userLogged: user.data.user, isLogged: true, isLoading: false });
          })
          .catch((error) => {
            console.warn('[ERROR] User infos with token not found!');
            this.setState({ curPage: 'Login', userLogged: null, isLogged: false, isLoading: false });
          });
        }
        else 
          this.setState({ curPage: 'Login', isLogged: false, isLoading: false });
      }
      else {
        console.warn('[SUCCESS] User infos found!');
        this.setState({ curPage: 'Home', isLogged: true, isLoading: false });
      }
    }
    else {
      console.warn('[INFO] Token not found!');
      this.setState({ curPage: 'Login', userLogged: null, isLogged: false, isLoading: false });
    }
  }

  // Mise en page des composants.
  setComponent() {
    const { curPage, articles, userLogged } = this.state;
    switch (curPage) {
      case 'Login':
        return (<><Log /></>);
      case 'Home':
        return (<><Home articles={articles} userLogged={userLogged} /></>);
      default:
        break;
    }
  }

  // Rechargement de l'API.
  static ReloadApp() {
      console.log('Reloading App!');
      window.location.reload(false);
  }

  render() {
    const { error, isLoading } = this.state;
    return (<>
      {!isLoading ? (<>
        <Header />
          <main>
            {error || error !== '' ? <p className="error">{error}</p> : null}
            {this.setComponent()}
          </main>
      </>) : <Loader />}
    </>)
  }
}
