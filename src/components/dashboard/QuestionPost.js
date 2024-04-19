import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import question1 from "../../assets/images/users/user.png";
import question2 from "../../assets/images/users/user.png";
import question3 from "../../assets/images/users/user.png";
import question4 from "../../assets/images/users/user.png";
import question5 from "../../assets/images/users/user.png";
import question6 from "../../assets/images/users/user.png";

import "../../assets/scss/layout/_questionPost.scss";

const QuestionPost = ({ profileImage, authorName, authorNickname, title, date }) => {
    
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/questions')
            .then(res => res.json())
            .then(data => setQuestions(data))
            .catch(error => console.error("Error fetching questions:", error));
    }, []);

    const getImagePath = (id) => {
        const img = [question1, question2, question3, question4, question5, question6];
        return img[id - 1];
    };
    
    return (
            <div className="questions">
                {questions.map((question, key) => (
                    <QuestionCard>
                    <div 
                        className={`questions__item p${key + 1} d-flex`} 
                        key={key}>

                        <div className="question__img">
                            <img src={getImagePath(question.id)} alt={`question ${question.id}`} />
                        </div>

                        <div className="question__author">
                            <p>{question.authorName}</p>
                            <p>{question.authorNickname}</p>
                        </div>

                        <div className="question__title">
                            <p>{question.title}</p>
                        </div>

                        <div className="question__date">
                            <p>{question.date}</p>
                        </div>

                    </div>
                    </QuestionCard>
                ))}
            </div>
    );
};

export default QuestionPost;