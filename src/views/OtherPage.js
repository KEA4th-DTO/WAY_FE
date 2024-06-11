import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../assets/style/_myPage.scss";
import Followers from "../components/Followers";
import Followings from "../components/Followings";
import axios from "axios";
import WayTag from "../components/main/Waytag";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const { nickname } = useParams();
  const [activeTab, setActiveTab] = useState("followers");
  const [profile, setProfile] = useState({
    imageUrl: "",
    name: "",
    nickName: "",
    bio: "",
    dailyCount: "",
    historyCount: "",
    postsCount: 0,
    followersCount: 0,
    followingsCount: 0,
    tags: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Nickname from useParams:", nickname); // 닉네임 로그 추가
    const fetchProfile = async () => {
      const Server_IP = process.env.REACT_APP_Server_IP;
      try {
        const response = await axios.get(
          `${Server_IP}/member-service/profile/${nickname}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = response.data.result;
        setProfile({
          imageUrl: data.profileImageUrl,
          name: data.name,
          nickName: data.nickname,
          bio: data.introduce,
          dailyCount: data.dailyCount,
          historyCount: data.historyCount,
          followersCount: data.followerCount,
          followingsCount: data.followingCount,
          tags: data.wayTags.slice(0, 3),
        });
      } catch (error) {
        console.error(`Error fetching profile: ${error}`);
      }
    };
    fetchProfile();
  }, [nickname]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleFollowChange = (type, increment) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [`${type}Count`]: prevProfile[`${type}Count`] + (increment ? 1 : -1),
    }));
  };

  const handleMapClick = (event) => {
    event.stopPropagation();
    const storedNickname = localStorage.getItem("userNickname");
    console.log("Stored Nickname:", storedNickname);
    console.log("Profile Nickname:", nickname);
    console.log(storedNickname === nickname);
    if (storedNickname === nickname) {
      navigate('/mymap');
    } else {
      navigate('/othersmap', { state: { nickname } });
    }
  };

  const renderTags = () => {
    const defaultTags = ["태그1", "태그2", "태그3"];
    const hasDefaultTags = profile.tags.every((tag) =>
      defaultTags.includes(tag)
    );

    if (hasDefaultTags) {
      return (
        <div className="no-tag">
          게시물 개수가 부족하여 아직 태그가 생성되지 않았습니다.
        </div>
      );
    }
    return profile.tags.map((tag, index) => <WayTag key={index} value={tag} />);
  };

  return (
    <div className="mypage-container">
      <div className="myPage-leftpanel">
        <div
          className="profile-background"
          style={{
            backgroundImage: `url(${profile.imageUrl})`,
          }}
        >
          <div className="profile-content">
            <img
              src={profile.imageUrl}
              alt="프로필 사진"
              className="profile-img"
            />
            <h1 className="userName">{profile.name}</h1>
            <p className="nickName">{profile.nickName}</p>
            <p className="bio">{profile.bio}</p>
            <div className="btn-container">
              <button className="btn-post" onClick={handleMapClick}>
                <span className="tab-count">
                  {profile.dailyCount + profile.historyCount}
                </span>
                <span className="tab-label">게시글</span>
                <span className="hover-text">맵으로 이동</span>
              </button>
              <button
                className="btn-followers"
                onClick={() => handleTabClick("followers")}
              >
                <span className="tab-count">{profile.followersCount}</span>
                <span className="tab-label">팔로워</span>
              </button>
              <button
                className="btn-followings"
                onClick={() => handleTabClick("followings")}
              >
                <span className="tab-count">{profile.followingsCount}</span>
                <span className="tab-label">팔로잉</span>
              </button>
            </div>
          </div>
        </div>
        <div className="tag-container">{renderTags()}</div>
      </div>
      <div className="myPage-rightpanel">
        {activeTab === "followers" && (
          <Followers nickname={nickname} onFollowChange={handleFollowChange} />
        )}
        {activeTab === "followings" && (
          <Followings nickname={nickname} onFollowChange={handleFollowChange} />
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
