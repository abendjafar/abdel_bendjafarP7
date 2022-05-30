import React from "react";
import axios from "axios";
// Import component
import App from "../App";
import Comment from "./Comment";
import Avatar from "../Avatar/Avatar";
import TinyLoader from "../TinyLoader/TinyLoader";
// Import style
import "./Comments.css";

export default class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // DATAS
            userLogged: props.userLogged,
            articleId: props.articleId,
            comments: props.comments,
            valueComment: '',
            fileUpload: null,
            // OPTIONS
            isClicked: false,
            isValid: true,
            isLoading: false
        }
        // Request Url
        this.commentUrl = 'http://localhost:8080/api/comments';
        // OnClick
        this.OnSubmitComment = this.OnSubmitComment.bind(this);
        this.OnChange = this.OnChange.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.onOptionsClick = this.onOptionsClick.bind(this);
    }

    // Gestion de l'envoi.
    OnSubmitComment(event) {
        const { userLogged, articleId, valueComment, fileUpload } = this.state;
        // Object contain value forms
        const formData = new FormData();
        formData.append("userId", userLogged.id);
        formData.append("comment", valueComment);
        formData.append("image", fileUpload);
        formData.append("articleId", articleId);

        event.preventDefault();
        // Post request.
        axios.post(this.commentUrl, formData, {
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token")
            }
        }).then( () => { App.ReloadApp(); })
        .catch(error => {
            console.error('Error Add Comment!');
            console.warn(error);
        });
    }

    // Gestion des events.
    OnChange(event) {
        const myState = event.target.name;
        switch (myState) {
            case 'comment':
                if(event.target.value.length) {
                    event.target.className = "valid";
                    this.setState({ isValid: false });
                }
                else {
                    event.target.className = "";
                    this.setState({ isValid: true });
                }
                this.setState({valueComment: event.target.value});
                break;
            case 'image':
                this.setState({fileUpload: event.target.files[0]});
                break;
            default:
                console.error('Nothing here!');
                break;
        }
    }

    // Suppression d'un commentaire.
    async onDeleteClick(event) {
        const commentId = event.target.value;
        if(window.confirm('Êtes vous sûre ?')) {
            // Delete request.
            await axios.delete(this.commentUrl+'/'+commentId, {
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("token")
                }
            }).then(() => App.ReloadApp());
        }
    }

    // Afficher/Cacher les options.
    onOptionsClick() {
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

    // Convertisseur de date.
    convertDate(myDate) {
        const start = new Date(myDate).getTime();
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
        const { userLogged, comments } = this.state;
        const { isValid, valueComment } = this.state
        return (<>
            {comments ? comments.map((comment, i) => (<>
                <Comment key={'comment-'+comment.id} userLogged={userLogged} comment={comment} onDeleteClick={this.onDeleteClick} />
            </>)) : (<><TinyLoader /></>)}

            <form className="addComment" onSubmit={this.OnSubmitComment} disabled={isValid}>
                <Avatar key={'avatar-'+userLogged.id} dataUser={{...userLogged, isProfile: false}} />
                <label htmlFor="comment">comment</label>
                <input id="comment" type='text' name="comment" placeholder='Ecrivez un commentaire...'
                value={valueComment} onChange={this.OnChange} />
                <button aria-label="sendComment" disabled={isValid}>
                    <i className="fa-solid fa-paper-plane" alt="sendComment"></i>
                </button>
                <input type='hidden' name="userId" value={userLogged.id} />
            </form>
        </>)
    }
}
