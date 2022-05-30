import React from "react";
import axios from "axios";
// Import components
import App from "../App";
import Avatar from "../Avatar/Avatar";
import Articles from "../Articles/Articles";
import Loader from "../Loader/Loader";
// For Profile
import Profile from "../Profile/Profile";
// For Admin
import Admin from "../Admin/Admin";
// Import styles
import "./Home.css";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // DATAS
      articles: props.articles,
      userLogged: props.userLogged,
      jobsList: null,
      // OPTIONS
      isLoading: false,                   // Active for all get request
      curPage: 'Home'
    }
    // Url
    this.jobUrl = 'http://localhost:8080/api/jobs';
    // OnClick
    this.navigateTo = this.navigateTo.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    this.getJobs();
  }

  // Récuperation des emplois.
  async getJobs() {
    const { curJobId } = this.state;
    this.setState({ isLoading: true });
    let jobs = await axios.get(this.jobUrl).then((res) => {
      res.data.jobs.forEach((job, index) => {
        if(job.id === curJobId) this.setState({ curPosJob: index });
      });
      return res.data.jobs;
    })
    this.setState({ jobsList: jobs, isLoading: false });
  }

  // Modification de la page à afficher.
  navigateTo(event) {
    const myPage = event.target.id;
    this.setState({ curPage: myPage });
  }

  // Déconnexion de l'utilisateur.
  logout() {
    if(window.confirm('Vous êtes sur le point de vous déconnectez...\nÊtes vous sûre ?')) {
      sessionStorage.clear();
      App.ReloadApp();
    }
  }

  // Mise en place du composant selon la page actuelle. (curPage)
  setComponent() {
    const { curPage, articles, jobsList, userLogged } = this.state;
    switch (curPage) {
      case 'Home':
          return (<><Articles articles={articles} userLogged={userLogged} navigateTo={this.navigateTo} logout={this.logout} /></>);
      case 'Profile':
          return (<><Profile userLogged={userLogged} jobsList={jobsList} navigateTo={this.navigateTo} logout={this.logout} /></>);
      case 'Admin':
        return (<><Admin userLogged={userLogged} jobsList={jobsList} navigateTo={this.navigateTo} logout={this.logout} /></>);
      default:
      break;
    }
  }

  render() {
    const { isLoading, curPage, userLogged } = this.state;
    return (<>
      <nav>
          {userLogged ? <Avatar dataUser={userLogged} isClickable={true} navigateTo={this.navigateTo} logout={this.logout} /> : null}
      </nav>

      {!isLoading && curPage ? (<>
        {this.setComponent()}
      </>) : (<><Loader /></>)}

    </>)
  }
}
