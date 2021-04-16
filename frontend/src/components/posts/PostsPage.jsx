import React, { useEffect, useState } from "react";
import PostsApi from '../../api/PostsApi';

// Components
import PostForm from "./Form";
import Post from './Card';
// import "./PostsPage.css";

function PostsPage({user}) {
    
    const [ posts, setPosts ] = useState([]) // Will contain all posts
    const [ newPostComponentOn, setNewPostComponentOn ] = useState(false);
    const [ allPostsOn, setAllPostsOn ] = useState(true);
    const [ onlyUserPostsOn, setOnlyUserPostsOn ] = useState(false);

    const handleClickCreate = () => {
        setNewPostComponentOn(!newPostComponentOn)
        setAllPostsOn(false)
        setOnlyUserPostsOn(false)
    }
    const handleClickAll = () => {
        setNewPostComponentOn(false)
        setAllPostsOn(!allPostsOn)
        setOnlyUserPostsOn(false)
    }
    const handleClickMyPosts = () => {
        setNewPostComponentOn(false)
        setAllPostsOn(false)
        setOnlyUserPostsOn(!onlyUserPostsOn)
    }

    function getAllPosts() {
        PostsApi.getAllPosts()
            .then((data) => {
                setPosts(data.data);
            })
    }

    // Load all Posts once, when opening Page
    useEffect(() => {
        getAllPosts();
        const postTimer = setInterval(() => {
            getAllPosts();
        }, 2000);

        return () => {
            clearInterval(postTimer)
        }
    }, [])

    

    // Delete post is at this level because if we delete the post directly inside itself, it will generate issues
    function deletePost(postId) {
        PostsApi.deletePost(postId)
            .then(() => {
                getAllPosts(); // to refresh the list immediately
            })
    }

    function likePost(post){
        const newPost = {
            id: post.id,
            postTitle: post.postTitle, 
            postBody: post.postBody,
            likes: post.likes + 1,
            disLikes: post.disLikes,
            user: post.user    
        }

        PostsApi.updatePost(newPost)
            .then(() => {
                getAllPosts();
            })
    }
    function disLikePost(post){
        const newPost = {
            id: post.id,
            postTitle: post.postTitle, 
            postBody: post.postBody,
            likes: post.likes,
            disLikes: post.disLikes + 1,
            user: post.user    
        }
        PostsApi.updatePost(newPost)
            .then(() => {
                getAllPosts();
            })
    }

    return (
        <div className="PostPage">
            {/* <div className="container d-flex justify-content-around mb-4">
                <button 
                    className="btn btn-sm btn-info"
                    onClick={handleClickCreate} aria-pressed="true"
                >Create Post</button>
                <button 
                    className="btn btn-sm btn-info"
                    onClick={handleClickAll} aria-pressed="true"
                >All Posts</button>
                <button 
                    className="btn btn-sm btn-info"
                    onClick={handleClickMyPosts} aria-pressed="true" 
                >My Posts</button>
            </div> */}
            <div class="container d-flex justify-content-around mb-4 btn-group btn-group-toggle" data-toggle="buttons">
                <label class="btn btn-secondary">
                    <input type="radio" name="options" id="option1" autocomplete="off" checked onClick={handleClickCreate}/> Create Post
                </label>
                <label class="btn btn-secondary active">
                    <input type="radio" name="options" id="option2" autocomplete="off" onClick={handleClickAll} /> All Posts
                </label>
                <label class="btn btn-secondary">
                    <input type="radio" name="options" id="option3" autocomplete="off" onClick={handleClickMyPosts}/> My Posts
                </label>
            </div>



            { newPostComponentOn && <PostForm posts={posts} getAllPosts={getAllPosts} user={user}/> }

            { !newPostComponentOn && (allPostsOn || onlyUserPostsOn) &&
            <div className= "post-div">
                { posts.length === 0 ? "No posts yet" :
                    posts
                        .filter((post) => allPostsOn ? true : post.user.id === user.id )
                        .sort((p1, p2) => p1.id > p2.id ? -1 : 1)
                        .map((post) => 
                        <Post key={post.id} post={post} user={user} deletePost={deletePost} 
                        likePost={likePost} disLikePost={disLikePost}/>
                    )
                }
            </div>
            }
        </div>
    );
}
export default PostsPage;
