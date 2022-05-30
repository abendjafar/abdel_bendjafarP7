import React from "react";
import axios from "axios";
// Import components
import App from "../App";
import Avatar from "../Avatar/Avatar";
import Comments from "../Comments/Comments";
import Options from "../Options/Options";
import TinyLoader from "../TinyLoader/TinyLoader";
// Import style
import "./Article.css";

export default class Article extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Datas
      article: props.dataArticle,
      author: props.dataArticle.user,
      userLogged: props.userLogged,
      valueArticle: props.dataArticle.article,
      likes: props.dataArticle.likes,
      fileUpload: null,
      // Comments
      comments: props.dataArticle.comments,
      commentsLoaded: false,
      // Options
      editArticle: false,
      isEdited: false,
      isClicked: false,
      showComments: false
    };
    this.totalLike = props.dataArticle.likes.length;
    this.totalComments = props.dataArticle.comments.length;
    // Request Url
    this.commentsUrl = 'http://localhost:8080/api/comments?article='+this.state.article.id;
    this.articleUrl = 'http://localhost:8080/api/articles/';
    this.likeUrl = 'http://localhost:8080/api/likes';
    // Form control
    this.onCommentsClick = this.onCommentsClick.bind(this);
    this.onLikesClick = this.onLikesClick.bind(this);
    this.onOptionsClick = this.onOptionsClick.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.OnChange = this.OnChange.bind(this);
    this.onDeleteImage = this.onDeleteImage.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
  }
  
  // Afficher/Cacher les commentaires.
  async onCommentsClick(event) {
    const { showComments, commentsLoaded } = this.state;
    switch (showComments) {
      // Hide Comments.
      default:
      case true:
        event.target.classList.remove('active');
        this.setState({ showComments: false });
        break;
      // Show Comments.
      case false:
        if(!commentsLoaded) {
          let comments = await axios.get(this.commentsUrl, {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token")
            }
          })
          .then((res) => {
            if(res.status === 204) return [];
            return res.data.comments;
          });
          this.setState({ comments: comments });
          if(comments) this.setState({ commentsLoaded: true });
        }
        event.target.classList.add('active');
        this.setState({ showComments: true });
        break;
    }
  }

  // Like/Unlike l'article.
  async onLikesClick(event) {
    const { article, userLogged } = this.state;
    const postLike = {
      userId: userLogged.id,
      articleId: article.id
    }
    this.setState({ isLoading: true });
    await axios.post(this.likeUrl, postLike, {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token")
      }
    }).then((res) => {
      // Update class target
      if(!res.data?.length) event.target.classList.add("active");
      else event.target.classList.remove("active");
      this.updateArticle();
    });
  }

  // Actualise les données de l'article pour les likes.
  updateArticle() {
    const { article } = this.state;
    axios.get(this.articleUrl, {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token")
      }
    }).then( (res) => {
      res.data.articles.forEach((result) => {
        if(result.id === article.id) {
          this.setState({ article: result });
          this.totalLike = result.likes.length;
        }
      });
    })
  }

  // Mise en page des options.
  setOptions() {
    const { likes, userLogged } = this.state;
    let isActive = '';
    likes.forEach(like => {
      if(like.userId === userLogged.id) isActive = "active";
    });

    return (
      <ul className="options">
        <li className={"like "+isActive} onClick={this.onLikesClick} ><i className="fa-solid fa-heart"></i> J'aime</li>
        <li className="comments" onClick={this.onCommentsClick}><i className="fa-solid fa-comment"></i> Commentaires</li>
      </ul>
    );
  }

  // Afficher/Cacher les options.
  async onOptionsClick(event) {
    const { isClicked } = this.state;
    switch (isClicked) {
      // Hide Options.
      default:
      case true:
        this.setState({ isClicked: false });
        break;
      // Show Options.
      case false:
        this.setState({ isClicked: true });
        break;
    }
  }

  // Modification d'un article.
  async onEditClick(event) {
    event.preventDefault();
    const { valueArticle, fileUpload } = this.state;
    const { article, editArticle, isEdited } = this.state;

    if(editArticle) {
      if(isEdited) {
        // Object contain value forms
        const formData = new FormData();
        formData.set("message", valueArticle);
        if(fileUpload != null) formData.append("image", fileUpload);
        // Update request.
        await axios.put(this.articleUrl+article.id, formData, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token")
          }
        }).then(() => {
          this.setState({ editArticle: false });
          App.ReloadApp();
        });
      }
      else this.setState({ editArticle: false });
    }
    else {
      this.setState({ editArticle: true });
    }
  }

  // Gestion des events.
  OnChange(event) {
    const { article } = this.state;
    const myCase = event.target.name;
    switch (myCase) {
      case 'message':
        if(article.article !== event.target.value) this.setState({ isEdited: true });
        else this.setState({ isEdited: false });
        this.setState({ valueArticle: event.target.value });
        break;
      case 'picture':
        console.log(event.target.files[0]);
        this.setState({ isEdited: true, fileUpload: event.target.files[0] });
        break;
      default:
        console.error('Nothing here!');
        break;
    }
  }

  // Suppression d'une image.
  async onDeleteImage() {
    const { article } = this.state;
    if(window.confirm('Vous êtes sur le point de supprimer votre image...\nEtes vous sure ?')) {
      // Delete request.
      await axios.delete(this.articleUrl+article.id+'/'+1, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token")
        }
      })
      .then(() => App.ReloadApp());
    }
  }

  // Suppression d'un article.
  async onDeleteClick() {
    const { article } = this.state;
    if(window.confirm('Vous êtes sur le point de supprimer cet article...\nÊtes vous sûre ?')) {
      // Delete request.
      await axios.delete(this.articleUrl+article.id+'/'+0, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token")
        }
      })
      .then(() => App.ReloadApp());
    }
  }

  // Convertisseur de date.
  convertDate() {
    const { article } = this.state;
    const start = new Date(article.postDate).getTime();
    const current = Date.now();
    const result = new Date(current-start);
    let since = new Date(result);
    if(since.getFullYear() <= 1970 )
      if(since.getMonth()+1 <= 1)
        if(since.getDate() <= 1)
          if(since.getHours() <= 1)
            if(since.getMinutes() < 1)
              since = new Date(result).getSeconds()+'sec.';
            else since = since.getMinutes()+'min.';
          else since = since.getHours()+'h.';
        else since = since.getDate()+'j.';
      else since = since.getMonth()+1+'m.';
    else since = since.getFullYear()+'y.';

    return `${since}`;
  }

  render() {
    const { editArticle, article, likes, author, userLogged } = this.state;
    const { isClicked } = this.state;
    const { showComments, comments, commentsLoaded } = this.state;
    const { valueArticle, fileUpload } = this.state;
    return (<>

      {!editArticle ? (<>
        {article ? (<>
          <article key={article.id+'-article'}>
            <div className="article-author">
              <Avatar dataUser={{...author, isProfile: false}} />
              <div className="author-infos">
                <h3>{author.firstname} {author.lastname}</h3>
                <h4>{author.job.jobs} | <i className="fa-solid fa-clock"></i> {this.convertDate()}</h4>
              </div>

              {article.authorId === userLogged.id || userLogged.isAdmin ? (<>
                <div className="article-options" onClick={this.onOptionsClick}>
                  <i className="fa-solid fa-ellipsis"></i>
                  {isClicked ? (<>
                    <Options onEditClick={this.onEditClick} onDeleteClick={this.onDeleteClick} dataArticle={article} for={'Article'} />
                  </>) : null}
                </div>
              </>) : (<>
                <div className="article-no-options"></div>
              </>)}
            </div>

            <p>{article.article}</p>
            {article.image === 'none' ? null : <img src={article.image} alt='postedImage' />}

            <div className="infos-total">
              {likes && this.totalLike >= 1 ? (<>
                <p className="like"><i className="fa-solid fa-heart"></i> {this.totalLike} J'aime</p>
              </>) : null}
              {/*<p className="like"><i className="fa-solid fa-heart"></i> 1 J'aime</p>*/}
              {comments.length ? (<>
                  <p className="comment">{comments.length} commentaire(s) <i className="fa-solid fa-comment"></i></p>
              </>) : null}
            </div>

            {this.setOptions()}

            {showComments ? (<>

              {commentsLoaded ? (<>
                <Comments userLogged={userLogged} articleId={article.id} comments={comments} />
              </>) : (<><TinyLoader /></>)}

            </>) : null}
          </article>
        </>) : (<><TinyLoader /></>)}

      </>) : (<>
        <article key={'edit-article-'+article.id}>
          <div className="article-author">
            <Avatar dataUser={{...author, isProfile: false}} />
            <div className="author-infos">
              <h3>{author.firstname} {author.lastname}</h3>
              <h4>{author.job.jobs} | <i className="fa-solid fa-clock"></i> {this.convertDate()}</h4>
            </div>
            <div className="article-no-options">
            <button onClick={this.onEditClick}><span className="hidden">confirm edit article</span><i className="fa-solid fa-check"></i></button>
            </div>
          </div>

          <form onSubmit={this.onEditClick}>
            <label htmlFor="message">message</label>
            <input id="message" type='text' name="message" placeholder='Un petit mot ?'
            defaultValue={valueArticle} onChange={this.OnChange}/>

            <div className='article-edit-avatar'>
              <label htmlFor="picture" className="file-upload" onChange={this.OnChange}>
                <span className="hidden">picture</span>
                {fileUpload ? <i className="fa-solid fa-xmark"></i> : <i className="fa-solid fa-image"></i>}
              </label>
                <input id="picture" name='picture' type='file' label='UploadImage'
                accept=".jpg,.jpeg,.png,.gif" onChange={this.OnChange} />
              {article.image !== 'none' ? (<>
                <button label='delAvatar' onClick={this.onDeleteImage}>
                  <span className="hidden">delete Avatar</span>
                  <i className="fa-solid fa-trash"></i>
                </button>
                <img src={article.image} alt='postedImage' />
              </>) : null}
            </div>
          </form>
        </article>
      </>)}
    </>
    )
  }
}
