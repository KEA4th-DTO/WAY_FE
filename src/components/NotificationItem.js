import React from "react";
import "../assets/style/_notification.scss";

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

const NotificationItem = ({ notification }) => {
  let notificationClass = "notification-item";

  const message = notification.message;
  if (/대댓글을 남겼습니다/.test(message)) {
    notificationClass += " notification-reply";
  } else if (/댓글을 남겼습니다/.test(message)) {
    notificationClass += " notification-comment";
  } else if (/좋아요를 눌렀습니다/.test(message)) {
    notificationClass += " notification-like";
  }

  return (
    <div className={notificationClass}>
      <div>{notification.message}</div>
      <div className="notification-time">
        {getTimeDifference(notification.createdAt)}
      </div>
    </div>
  );
};

export default NotificationItem;
