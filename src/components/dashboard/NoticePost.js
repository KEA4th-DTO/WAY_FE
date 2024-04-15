import React, { useState, useEffect } from 'react';
import NoticeCard from './NoticeCard';
import post1 from "../../assets/images/users/user.png";
import post2 from "../../assets/images/users/user.png";
import post3 from "../../assets/images/users/user.png";
import post4 from "../../assets/images/users/user.png";
import post5 from "../../assets/images/users/user.png";
import post6 from "../../assets/images/users/user.png";

import "../../assets/scss/_noticePost.scss"

const NoticePost = ({ profileImage, authorName, authorNickname, title, date }) => {
    
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/posts')
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(error => console.error("Error fetching posts:", error));
    }, []);

    const getImagePath = (id) => {
        const img = [post1, post2, post3, post4, post5, post6];
        return img[id - 1];
    };
    
    return (
            <div className="posts">
                {posts.map((post, key) => (
                    <NoticeCard>
                    <div 
                        className={`posts__item p${key + 1} d-flex`} 
                        key={key}>

                        <div className="post__img">
                            <img src={getImagePath(post.id)} alt={`Post ${post.id}`} />
                        </div>

                        <div className="post__author">
                            <p>{post.authorName}</p>
                            <p>{post.authorNickname}</p>
                        </div>

                        <div className="post__title">
                            <p>{post.title}</p>
                        </div>

                        <div className="post__date">
                            <p>{post.date}</p>
                        </div>

                    </div>
                    </NoticeCard>
                ))}
            </div>
    );
};

export default NoticePost;