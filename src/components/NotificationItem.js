import React, { useState } from "react";
import "../assets/style/_notification.scss";
import axios from "axios";

const getTimeDifference = (timestamp) => {
  const now = new Date();
  const createdAt = new Date(timestamp);
  const diffInSeconds = Math.floor((now - createdAt) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}초 전`;
  } else if (diffInSeconds < 3600) {
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    return `${diffInMinutes}분 전`;
  } else if (diffInSeconds < 86400) {
    const diffInHours = Math.floor(diffInSeconds / 3600);
    return `${diffInHours}시간 전`;
  } else {
    const diffInDays = Math.floor(diffInSeconds / 86400);
    return `${diffInDays}일 전`;
  }
};

const NotificationItem = ({ notification, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  let notificationClass = "notification-item";
  if (isDeleting) notificationClass += " deleting";

  const message = notification.message;
  if (/대댓글을 남겼습니다/.test(message)) {
    notificationClass += " notification-reply";
  } else if (/댓글을 남겼습니다/.test(message)) {
    notificationClass += " notification-comment";
  } else if (/게시글에 좋아요를 눌렀습니다/.test(message)) {
    notificationClass += " notification-postlike";
  } else if (/팔로우하기/.test(message)) {
    notificationClass += " notification-follow";
  } else if (/댓글에 좋아요를 눌렀습니다/.test(message)) {
    notificationClass += " notification-commentlike";
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    setTimeout(async () => {
      try {
        const Server_IP = process.env.REACT_APP_Server_IP;
        await axios.delete(
          `${Server_IP}/notification-service/notification/delete/${notification.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        onDelete(notification.id);
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    }, 500); // 500ms 후 삭제 API 호출 및 상태 업데이트
  };

  return (
    <div className={notificationClass}>
      <div className="notification-message">{notification.message}</div>
      <div className="notification-time">
        {getTimeDifference(notification.createdAt)}
      </div>
      <button className="notification-delete" onClick={handleDelete}>
        X
      </button>
    </div>
  );
};

export default NotificationItem;
