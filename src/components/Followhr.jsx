import React, { useEffect, useState } from "react";
import axios from "axios";
import useimage from "../assets/address.jpg";
import { Toaster, toast } from "sonner";
import API_URL from "../config";

const Followhr = () => {
  const [topCustomers, setTopCustomers] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/jobs/getAlljobs`);
        const jobs = response.data;

        // Count jobs per customer
        const customerJobCount = {};
        jobs.forEach((job) => {
          const customer = job.postedBy?.username || "Unknown";
          customerJobCount[customer] = (customerJobCount[customer] || 0) + 1;
        });

        // Convert to array and sort by job count (descending)
        const sortedCustomers = Object.entries(customerJobCount)
          .map(([customer, jobCount]) => ({ customer, jobCount }))
          .sort((a, b) => b.jobCount - a.jobCount)
          .slice(0, 5); // Get top 5 customers

        setTopCustomers(sortedCustomers);
      } catch (error) {
        console.error("Error fetching job data:", error);
        setTopCustomers([]);
      }
    };

    fetchJobs();
  }, [API_URL]);

  return (
    <>
      <Toaster />
      <div className="card-body pb-0">
        <h5 className="card-title">Top Hiring Managers</h5>
        <div className="news">
          {topCustomers.length > 0 ? (
            topCustomers.map((customer, index) => (
              <div
                key={index}
                className="post-item clearfix"
                style={{
                  borderBottom: "1px solid gray",
                  paddingBottom: "5px",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <img
                      style={{ height: "60px", width: "60px" }}
                      src={useimage}
                      alt=""
                    />
                    <h4>
                      <a href="#">{customer.customer}</a>
                    </h4>
                    <span style={{ color: "#b1bad3", marginLeft: "10px" }}>
                      Jobs: {customer.jobCount}
                    </span>
                  </div>
                  <div>
                    <button
                      className="usbutton"
                      onClick={() =>
                        toast.info(
                          "This feature will be available soon. We're sorry for now."
                        )
                      }
                    >
                      Follow
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No top customers available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Followhr;
