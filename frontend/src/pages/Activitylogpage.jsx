import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { getAllActivityLogs, getsingleUserActivityLogs } from "../features/activitySlice";
import TopNavbar from "../Components/TopNavbar";
import FormattedTime from "../lib/FormattedTime";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

const fallbackURL = "https://stockify-backend-six.vercel.app";
const socket = io(process.env.REACT_APP_BACKEND_URL || fallbackURL, {
   withCredentials: true,
   transports: ["websocket", "polling"], 
});

function Activitylogpage() {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const logsPerPage = 10;

  const { activityLogs, isFetching, userdata } = useSelector((state) => state.activity);
  const { Authuser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (Authuser?.id) {
      dispatch(getAllActivityLogs());
      dispatch(getsingleUserActivityLogs(Authuser.id));
    }

    socket.on("newActivityLog", (newLog) => {
      setLogs((prevLogs) => [newLog, ...prevLogs]);
    });

    return () => {
      socket.off("newActivityLog");
    };
  }, [dispatch, Authuser.id]);

  useEffect(() => {
    setLogs(activityLogs);
  }, [activityLogs]);

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = (logs || []).slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil((logs || []).length / logsPerPage);

  const handleDeleteOldLogs = async () => {
    try {
      const res = await axiosInstance.delete("activitylogs/deleteOldLogs");
      toast.success(res.data.message || "Logs cleaned up");
      dispatch(getAllActivityLogs());
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete old logs");
    }
  };

  return (
    <div className="bg-base-100 min-h-screen">
      <TopNavbar />
      <div className="mt-10 ml-5">
        <div className="flex items-center justify-between mb-4 mr-5">
          <h1 className="text-xl font-semibold">Activity Logs</h1>
          {Authuser?.role === 'admin' && (
            <button
              onClick={() => setShowConfirm(true)}
              className="btn btn-error btn-sm text-white"
            >
              Delete Logs &gt; 10
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-base-100 mb-24 border-gray-200 rounded-lg shadow-md">
            <thead className="bg-base-100">
              <tr>
                <th className="px-3 py-2 border w-5">#</th>
                <th className="px-3 py-2 border">Name</th>
                <th className="px-3 py-2 border">Email</th>
                <th className="px-3 py-2 border">Action</th>
                <th className="px-3 py-2 border">Affected Part</th>
                <th className="px-3 py-2 border">Description</th>
                <th className="px-3 py-2 border">Time</th>
                <th className="px-3 py-2 border">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.length > 0 ? (
                currentLogs.map((log, index) => (
                  <tr key={log._id}>
                    <td className="px-3 py-2 border">{indexOfFirstLog + index + 1}</td>
                    <td className="px-3 py-2 border">{log.userId?.name || "System"}</td>
                    <td className="px-3 py-2 border">{log.userId?.email || "N/A"}</td>
                    <td className="px-3 py-2 border">{log.action}</td>
                    <td className="px-3 py-2 border">{log.entity}</td>
                    <td className="px-3 py-2 border">{log.description}</td>
                    <td className="px-4 py-2 border">
                      <FormattedTime timestamp={log.createdAt} />
                    </td>
                    <td className="px-4 py-2 border">{log.ipAddress}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    <p>No activity logs available</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="join mt-4 mb-20 ml-72 flex justify-center">
          <button
            className="join-item btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`join-item btn ${currentPage === index + 1 ? "btn-active" : ""}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="join-item btn"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      {showConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">Are you sure you want to delete all older activity logs? This action cannot be undone.</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button
                className="btn btn-error text-white"
                onClick={() => {
                  setShowConfirm(false);
                  handleDeleteOldLogs();
                }}
              >
                Delete Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Activitylogpage;
