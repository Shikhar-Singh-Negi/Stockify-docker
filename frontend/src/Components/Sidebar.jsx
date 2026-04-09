import React, { useEffect } from 'react';
import { AiOutlineProduct } from "react-icons/ai";
import { RiStockLine } from "react-icons/ri";
import { FiLogOut, FiShoppingCart } from "react-icons/fi";
import { MdPointOfSale, MdOutlineCategory } from "react-icons/md";
import { TfiSupport } from "react-icons/tfi";
import { IoNotificationsOutline } from "react-icons/io5";
import { RxActivityLog, RxDashboard } from "react-icons/rx";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { logout, pendingUsers } from "../features/authSlice";
import toast from 'react-hot-toast';
import { LuUsers } from "react-icons/lu";
import logo1 from '../images/logo1.png'
function Sidebar() {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { Authuser, pendinguser } = useSelector((state) => state.auth);
  const pendingCount = Array.isArray(pendinguser) ? pendinguser.filter(u => !u.isApproved).length : 0;

  useEffect(() => {
    if (Authuser?.role === 'admin' || Authuser?.role === 'manager') {
      dispatch(pendingUsers());
    }
  }, [dispatch, Authuser]);

  const handleLogout = async () => {
    dispatch(logout())
      .then(() => {
        toast.success("Logout successfully");
        navigator('/');
      })
      .catch((error) => {
        toast.error("Error in logout");
      });
  };

  return (
    <div className="flex flex-col w-64 min-h-screen p-6 shadow-lg bg-slate-950 text-gray-300">
      <div className="flex flex-col items-center mb-10">
        <img src={logo1} className="w-24 bg-white rounded-md p-1" alt="sample logo" />
        <h1 className="text-lg font-bold text-white mt-4">Hi, {Authuser?.name || Authuser?.role || 'User'}</h1>
      </div>

      <nav className="space-y-4">
  
        <div className="text-lg mt-10 flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
          <RxDashboard className="text-xl" />
          <Link to={`/${Authuser?.role === 'staff' ? 'StaffDashboard' : Authuser?.role === 'admin' ? 'AdminDashboard' : 'ManagerDashboard'}`}>Dashboard</Link>
        </div>

   
        {Authuser?.role === "manager" && (
          <ul className="space-y-2">
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <AiOutlineProduct className="text-xl" />
              <Link to="/ManagerDashboard/product">Product</Link>
            </li>
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <RxActivityLog className="text-xl" />
              <Link to="/ManagerDashboard/activity-log">Activity Log</Link>
            </li>
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <TfiSupport className="text-xl" />
              <Link to="/ManagerDashboard/supplier">Supplier</Link>
            </li>
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <MdPointOfSale className="text-xl" />
              <Link to="/ManagerDashboard/sales">Sales</Link>
            </li>
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <FiShoppingCart className="text-xl" />
              <Link to="/ManagerDashboard/order">Order</Link>
            </li>
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <RiStockLine className="text-xl" />
              <Link to="/ManagerDashboard/stock-transaction">Stock Transaction</Link>
            </li>
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <IoNotificationsOutline className="text-xl" />
              <Link to="/ManagerDashboard/NotificationPageRead">Notifications</Link>
            </li>
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <MdOutlineCategory className="text-xl" />
              <Link to="/ManagerDashboard/category">Category</Link>
            </li>
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <LuUsers className="text-xl" />
              <Link to="/ManagerDashboard/Userstatus" className="flex items-center gap-2">
                Users
                {pendingCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full">
                    {pendingCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        )}


        {Authuser?.role === "admin" && (
          <ul className="space-y-2">
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <AiOutlineProduct className="text-xl" />
              <Link to="/AdminDashboard/product">Product</Link>
            </li>
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <RxActivityLog className="text-xl" />
              <Link to="/AdminDashboard/activity-log">Activity Log</Link>
            </li>
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <TfiSupport className="text-xl" />
              <Link to="/AdminDashboard/supplier">Supplier</Link>
            </li>
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <MdPointOfSale className="text-xl" />
              <Link to="/AdminDashboard/sales">Sales</Link>
            </li>
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <FiShoppingCart className="text-xl" />
              <Link to="/AdminDashboard/order">Order</Link>
            </li>
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <RiStockLine className="text-xl" />
              <Link to="/AdminDashboard/stock-transaction">Stock Transaction</Link>
            </li>
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <IoNotificationsOutline className="text-xl" />
              <Link to="/AdminDashboard/notifications">Create Notifications</Link>
            </li>
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <MdOutlineCategory className="text-xl" />
              <Link to="/AdminDashboard/category">Category</Link>
            </li>
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <LuUsers className="text-xl" />
              <Link to="/AdminDashboard/Userstatus" className="flex items-center gap-2">
                Users
                {pendingCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full">
                    {pendingCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        )}

        
        {Authuser?.role === "staff" && (
          <ul className="space-y-2">
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <AiOutlineProduct className="text-xl" />
              <Link to="/StaffDashboard/product">Product</Link>
            </li>

            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <TfiSupport className="text-xl" />
              <Link to="/StaffDashboard/supplier">Supplier</Link>
            </li>
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <MdPointOfSale className="text-xl" />
              <Link to="/StaffDashboard/sales">Sales</Link>
            </li>
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <FiShoppingCart className="text-xl" />
              <Link to="/StaffDashboard/order">Order</Link>
            </li>
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <RiStockLine className="text-xl" />
              <Link to="/StaffDashboard/stock-transaction">Stock Transaction</Link>
            </li>
            <li className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer p-2 rounded-md transition">
              <IoNotificationsOutline className="text-xl" />
              <Link to="/StaffDashboard/NotificationPageRead">Notifications</Link>
            </li>
          </ul>
        )}
      </nav>

      <div className="mt-auto border-t border-gray-600 pt-4">
        <div className="flex items-center space-x-3 text-lg text-gray-300 hover:text-red-400 cursor-pointer p-2 rounded-md transition">
          <FiLogOut className="text-xl" />
          <span onClick={handleLogout}>Logout</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
