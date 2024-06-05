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
    setTimeout(() => {
      loadMoreNotifications(true);
    }, 0); // loadMoreNotifications를 다음 이벤트 루프로 미룸
  }, [notifications]);

  const loadMoreNotifications = (initialLoad = false) => {
    if (initialLoad) {
      const initialNotifications = notifications.slice(0, itemsPerPage);
      setDisplayedNotifications(initialNotifications);
      if (initialNotifications.length >= notifications.length) {
        setHasMore(false);
      }
    } else {
      if (displayedNotifications.length >= notifications.length) {
        setHasMore(false);
        return;
      }
      const nextNotifications = notifications.slice(
        displayedNotifications.length,
        displayedNotifications.length + itemsPerPage
      );
      setDisplayedNotifications((prev) => [...prev, ...nextNotifications]);
      if (
        displayedNotifications.length + nextNotifications.length >=
        notifications.length
      ) {
        setHasMore(false);
      }
    }
  };

  const handleDelete = (id) => {
    setDisplayedNotifications((prev) =>
      prev.filter((notif) => notif.id !== id)
    );
  };

  const handleScroll = (e) => {
    if (
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 1 &&
      hasMore
    ) {
      loadMoreNotifications();
    }
  };

  return (
    <div className="notification-list" onScroll={handleScroll}>
      {displayedNotifications.map((notification, index) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDelete={handleDelete}
        />
      ))}
      {!hasMore && (
        <div className="notification-end">더 이상 알림이 없습니다.</div>
      )}
    </div>
  );
};

export default NotificationList;
