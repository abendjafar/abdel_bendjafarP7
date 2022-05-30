import React from "react";
import axios from "axios";
// Import component
import App from "../App";
import Avatar from "../Avatar/Avatar";
import Options from "../Options/Options";
// Import style

export default class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // DATAS
            userLogged: props.userLogged,
            comment: props.comment,
            valueComment: props.comment.comment,
            fileUpload: null,
            // OPTIONS
            editComment: false,
            isEdited: false,
            isClicked: false,
            isValid: false,
            isLoading: false
        }
        // Request Url
        this.commentUrl = 'http://localhost:8080/api/comments';
        // OnClick
        this.onOptionsClick = this.onOptionsClick.bind(this);
        this.onEditClick = this.onEditClick.bind(this);
        this.OnChange = this.OnChange.bind(this);
    }

    // Modification d'un commentaire.
    async onEditClick(event) {
        event.preventDefault();
        const { valueComment, fileUpload } = this.state;
        const { comment, editComment, isEdited } = this.state;

        if(editComment) {
            if(isEdited) {
                // Object contain value forms
                const formData = new FormData();
                formData.set("comment", valueComment);
                if(fileUpload != null) formData.append("image", fileUpload);
                // Update request.
                await axios.put(this.commentUrl+'/'+comment.id, formData, {
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("token")
                    }
                }).then(() => App.ReloadApp());
            }
            else this.setState({ editComment: false, isEdited: false });
        }
        else this.setState({ editComment: true });
    }

    // Gestion des events.
    OnChange(event) {
        const { comment } = this.state;
        const myState = event.target.name;
        switch (myState) {
            case 'comment':
                if(event.target.value.length) {
                    event.target.className = "valid";
                    this.setState({ isValid: false, isEdited: true });
                }
                else {
                    event.target.className = "";
                    this.setState({ isValid: true });
                }
                if(comment.comment !== event.target.value) this.setState({ isEdited: true });
                else this.setState({ isEdited: false });
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
        const { userLogged, comment, isClicked } = this.state;
        const { editComment, isValid, valueComment } = this.state;
        return (<>
            <div key={'div-comment'} className="comment">
                <Avatar key={'avatar-'+comment.id} dataUser={{...comment.user, isProfile: false}} />
                <div className="comment-content">
                    <h3>{comment.user.firstname} {comment.user.lastname}</h3>
                    {editComment ? (<>
                        <form onSubmit={this.onEditClick} className="editComment" disabled={isValid}>
                            <label htmlFor="comment">comment</label>
                            <input id="comment" type='text' name="comment" placeholder='Ecrivez un commentaire...'
                            value={valueComment} onChange={this.OnChange} />
                            <button aria-label="sendComment" disabled={isValid}>
                                <i className="fa-solid fa-paper-plane" alt="sendComment"></i>
                            </button>
                        </form>
                    </>) : (<><p>{comment.comment}</p></>)}
                    <h4>{comment.user.job.jobs} | <i className="fa-solid fa-clock"></i> {this.convertDate(comment.postDate)}</h4>
                </div>
                
                {!editComment && (comment.authorId === userLogged.id || userLogged.isAdmin) ? (<>
                <div className="article-options" onClick={this.onOptionsClick}>
                    <i className="fa-solid fa-ellipsis"></i>
                    {isClicked ? (<>
                    <Options onEditClick={this.onEditClick} onDeleteClick={this.props.onDeleteClick} for={'Comment'} commentId={comment.id} />
                    </>) : null}
                </div>
                </>) : (<><div className="article-no-options"></div></>)}
            </div>
        </>)
    }
}
