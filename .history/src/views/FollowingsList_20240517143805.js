import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FollowingList() {
  const nickname = 'id_222'; // 임시 사용자 닉네임
  const [followingList, setFollowingList] = useState([]);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://172.16.210.22/member-service/follow/haecheol/following-list`, {
          headers: {
            Authorization: 'Bearer accesstoken' // 인증 토큰
          }
        });
        setFollowingList(response.data.result);
      } catch (error) {
        console.error('Error fetching following list:', error);
      }
    };

    fetchData();
  }, [nickname]); // nickname이 변경될 때마다 다시 불러옴

  return (
    <div>
      <h2>Following List</h2>
      <ul>
        {followingList.map(user => (
          <li key={user.nickname}>
            <span>Nickname: {user.nickname}</span>
            <span>Name: {user.name}</span>
            {/* 추가 필드 표시 */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FollowingList;
