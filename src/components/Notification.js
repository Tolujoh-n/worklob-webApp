import React, { useState, useEffect } from "react";

function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const getTimeBasedGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good morning";
      if (hour < 18) return "Good afternoon";
      return "Good evening";
    };

    const notificationTemplates = [
      {
        type: "info",
        icon: "bi bi-info-circle text-primary",
        title: `${getTimeBasedGreeting()}! Welcome to WorkLob`,
        message:
          "WorkLob is your central hub for jobs, talent, and opportunities. Find jobs, connect with professionals, and grow your career all in one place.",
        time: "Just now",
      },
      {
        type: "success",
        icon: "bi bi-check-circle text-success",
        title: "Welcome to WorkLob!",
        message:
          "Start exploring new job opportunities, connect with employers, or showcase your skills to the world!",
        time: "Just now",
      },
      {
        type: "info",
        icon: "bi bi-lightbulb text-warning",
        title: "Discover Opportunities!",
        message:
          "Browse job listings, collaborate with freelancers, or hire top talent for your projects. WorkLob makes it all easy!",
        time: "Just now",
      },
    ];

    setNotifications(notificationTemplates);
  }, []);

  return (
    <div className="col-lg-12">
      <div className="pagetitle">
        <h1>Notifications</h1>
      </div>

      <section className="section contact">
        <div className="row gy-4">
          <div className="col-xl-12">
            <div className="notifications card p-4">
              <ul className="list-unstyled">
                {notifications.map((notification, index) => (
                  <li key={index} className="notification-item border-bottom">
                    <i className={notification.icon}></i>
                    <div>
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <p>{notification.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Notification;
