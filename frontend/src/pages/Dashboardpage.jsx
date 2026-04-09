import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Gettopproduct from "../lib/Gettopproduct";
import TopNavbar from "../Components/TopNavbar";
import { LuUsers, LuClock, LuActivity, LuIndianRupee, LuShoppingBag, LuBoxes } from "react-icons/lu"; // Icons for activity logs
import { getrecentActivityLogs } from "../features/activitySlice";
import { gettingallSales } from "../features/salesSlice";
import { gettingallOrder } from "../features/orderSlice";
import FormattedTime from "../lib/FormattedTime";
import { io } from "socket.io-client";

function Dashboardpage() {
  const { Authuser, staffuser, manageruser, adminuser } = useSelector((state) => state.auth);

  const { recentuser } = useSelector((state) => state.activity);
  const { getallsales } = useSelector((state) => state.sales);
  const { getorder } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getrecentActivityLogs());
    dispatch(gettingallSales());
    dispatch(gettingallOrder());

    const socket = io(process.env.REACT_APP_BACKEND_URL || "https://stockify-backend-six.vercel.app", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    // Listen for new activity logs
    socket.on("newActivityLog", (newLog) => {
      console.log("New activity log:", newLog);
      dispatch(getrecentActivityLogs());
    });

    return () => {
      socket.disconnect(); // Correctly disconnect on unmount
    };
  }, [dispatch]);

  return (
    <div className="bg-base-100">
      <TopNavbar />
      <div className="min-h-screen flex flex-col items-center p-10">
        <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10 w-full px-10">
          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center hover:shadow-xl transition-shadow border-b-4 border-blue-500">
            <LuIndianRupee className="text-4xl text-blue-500 mb-2" />
            <p className="text-2xl font-bold text-gray-700">
              ₹{getallsales?.reduce((acc, sale) => acc + (sale.totalAmount || 0), 0).toLocaleString() || 0}
            </p>
            <p className="text-gray-500 text-sm">Total Revenue</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center hover:shadow-xl transition-shadow border-b-4 border-green-500">
            <LuShoppingBag className="text-4xl text-green-500 mb-2" />
            <p className="text-2xl font-bold text-gray-700">
              {getorder?.filter(o => o.status !== "delivered").length || 0}
            </p>
            <p className="text-gray-500 text-sm">Active Orders</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center hover:shadow-xl transition-shadow border-b-4 border-purple-500">
            <LuBoxes className="text-4xl text-purple-500 mb-2" />
            <p className="text-2xl font-bold text-gray-700">
              {getallsales?.length || 0}
            </p>
            <p className="text-gray-500 text-sm">Total Sales</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center hover:shadow-xl transition-shadow border-b-4 border-red-500">
            <LuUsers className="text-4xl text-red-500 mb-2" />
            <p className="text-2xl font-bold text-gray-700">{staffuser?.length || 0}</p>
            <p className="text-gray-500 text-sm">Staff</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center hover:shadow-xl transition-shadow border-b-4 border-amber-500">
            <LuUsers className="text-4xl text-amber-500 mb-2" />
            <p className="text-2xl font-bold text-gray-700">{manageruser?.length || 0}</p>
            <p className="text-gray-500 text-sm">Managers</p>
          </div>
        </div>

        {/* Top Products Section */}
        <Gettopproduct className="mt-20" />
      </div>

      {/* Recent Activity Section */}
      {Authuser?.role !== "staff" && (
        <div className="mt-10 p-10 bg-gray-50">
          <h1 className="text-2xl font-bold mb-6">Recent Activity</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentuser?.length > 0 ? (
              recentuser.map((logs) => (
                <div
                  key={logs._id}
                  className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <LuActivity className="text-blue-500 text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">{logs.userId?.name || "System"}</h2>
                      <p className="text-sm text-gray-500">{logs.action}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <LuClock className="text-gray-500" />
                    <FormattedTime timestamp={logs.createdAt} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recent activity logs found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboardpage;