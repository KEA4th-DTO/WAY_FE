import React, { useState, useEffect } from "react";
import NotificationItem from "./NotificationItem";
import "../assets/style/_notification.scss";

const NotificationList = ({ notifications }) => {
  const [displayedNotifications, setDisplayedNotifications] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 6;

  useEffect(() => {
    setDisplayedNotifications([]);
    setHasMore(true);
    loadMoreNotifications();
  }, [notifications]);

  const loadMoreNotifications = () => {
    if (displayedNotifications.length >= notifications.length) {
      setHasMore(false);
      return;
    }
    const nextNotifications = notifications.slice(
      displayedNotifications.length,
      displayedNotifications.length + itemsPerPage
    );
    setDisplayedNotifications((prev) => [...prev, ...nextNotifications]);
  };

  const handleScroll = (e) => {
    if (
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight &&
      hasMore
    ) {
      loadMoreNotifications();
    }
  };

  return (
    <div className="notification-list" onScroll={handleScroll}>
      {displayedNotifications.map((notification, index) => (
        <NotificationItem key={index} notification={notification} />
      ))}
      {!hasMore && (
        <div className="notification-end">더 이상 알림이 없습니다.</div>
      )}
    </div>
  );
};

export default NotificationList;
