import React from "react";
// Import components
import Article from "../Article/Article";
import AddForm from "../Article/AddForm";
import TinyLoader from "../TinyLoader/TinyLoader";

// Page Articles
export default class Articles extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        // DATAS
        articles: props.articles,
        userLogged: props.userLogged,
        // OPTIONS
        isLoading: false
      }
    }
  
    render() {
      const { isLoading, articles, userLogged } = this.state;
      return (<>
  
        {!isLoading ? (<>
        
          <AddForm userLogged={userLogged} />
  
          {/* Boucle sur tous les articles */}
          {articles ? articles.map((article) => (<>
            <Article key={`${article.id}`} dataArticle={article} userLogged={userLogged} />
          </>)) : (<p className="error">Pas d'article actuellement!</p>)}
  
        </>) : (<><TinyLoader /></>)}
  
      </>)
    }
}
