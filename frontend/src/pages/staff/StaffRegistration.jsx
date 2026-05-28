// src/pages/staff/StaffRegistration.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StaffNavbar from "../../components/StaffNavbar";
import { FaSearch, FaTimes, FaCheckCircle, FaImage, FaVideo, FaTimesCircle } from "react-icons/fa";

const makeApi = (token) =>
  axios.create({
    baseURL: "http://localhost:8000",
    headers: { Authorization: `Bearer ${token}` },
  });

const StaffRegistration = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("staffToken");

  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [actionType, setActionType] = useState(""); // "accept" or "reject"

  useEffect(() => {
    if (!token) navigate("/staff/login");
  }, [token, navigate]);

  // Fetch pending submissions
  useEffect(() => {
    if (!token) return;

    const fetchPending = async () => {
      setLoading(true);
      try {
        const { data } = await makeApi(token).get("/api/submissions/admin/all/?status=PENDING");
        setPendingSubmissions(Array.isArray(data) ? data : data.results ?? []);
      } catch (err) {
        console.error("Failed to load submissions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, [token]);

  const filtered = pendingSubmissions.filter(sub =>
    sub.brand?.toLowerCase().includes(search.toLowerCase()) ||
    sub.model?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = async (status) => {
    if (!selected) return;

    setProcessing(true);
    setActionType(status === "APPROVED" ? "accept" : "reject");

    try {
      await makeApi(token).patch(`/api/submissions/admin/${selected.id}/update/`, {
        status: status
      });

      const message = status === "APPROVED" 
        ? `✅ Device accepted! Customer has been notified to bring it to the shop.`
        : `❌ Device rejected. Customer has been notified.`;

      setSuccessMessage(message);

      // Remove from pending list
      setPendingSubmissions(prev => prev.filter(s => s.id !== selected.id));
      setSelected(null);

    } catch (err) {
      alert(`Failed to ${status === "APPROVED" ? "accept" : "reject"} device.`);
      console.error(err);
    } finally {
      setProcessing(false);
      setActionType("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffNavbar />

      <main className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Device Registration</h1>
            <p className="text-gray-600">Review submissions and decide to accept or reject</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Pending List */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow border border-gray-100">
                <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                  <h2 className="font-semibold">Pending Submissions ({pendingSubmissions.length})</h2>
                  <div className="relative w-64">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search device..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 py-2 border border-gray-200 rounded-lg focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="p-4 max-h-[calc(100vh-250px)] overflow-y-auto">
                  {loading ? (
                    <div className="text-center py-12">Loading submissions...</div>
                  ) : filtered.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No pending submissions</div>
                  ) : (
                    filtered.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => setSelected(sub)}
                        className={`p-4 mb-3 rounded-xl border cursor-pointer transition-all hover:shadow ${
                          selected?.id === sub.id ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-semibold">{sub.brand} {sub.model}</p>
                            <p className="text-sm text-gray-500">{sub.customer_name || sub.customer_email}</p>
                          </div>
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">PENDING</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Submitted: {new Date(sub.submission_date).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right: Device Details + Actions */}
            <div className="lg:col-span-7">
              {selected ? (
                <div className="bg-white rounded-2xl shadow p-8">
                  <h2 className="text-2xl font-bold mb-6">{selected.brand} {selected.model}</h2>

                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div><strong>Customer:</strong> {selected.customer_name || selected.customer_email}</div>
                    <div><strong>Submitted:</strong> {new Date(selected.submission_date).toLocaleString()}</div>
                  </div>

                  <div className="mb-6">
                    <strong>Customer Description:</strong>
                    <p className="mt-3 bg-gray-50 p-5 rounded-xl leading-relaxed">{selected.condition_description}</p>
                  </div>

                  {/* Photos */}
                  {selected.photos?.length > 0 && (
                    <div className="mb-8">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <FaImage /> Photos ({selected.photos.length})
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {selected.photos.map((photo, i) => (
                          <img
                            key={i}
                            src={photo.image}
                            alt={`Photo ${i+1}`}
                            className="w-full h-40 object-cover rounded-xl border border-gray-200"
                            onError={(e) => (e.target.src = "https://placehold.co/400x300?text=Photo+Failed")}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleAction("APPROVED")}
                      disabled={processing}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <FaCheckCircle /> Accept Device
                    </button>

                    <button
                      onClick={() => handleAction("REJECTED")}
                      disabled={processing}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <FaTimesCircle /> Reject Device
                    </button>
                  </div>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    Customer will be notified via the portal
                  </p>

                  {successMessage && (
                    <div className="mt-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-xl flex items-center gap-3">
                      <FaCheckCircle className="text-xl" />
                      {successMessage}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl">
                  <FaImage className="text-6xl text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Select a submission from the left to review</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffRegistration;