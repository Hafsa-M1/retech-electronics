// src/pages/staff/StaffDiagnostics.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StaffNavbar from "../../components/StaffNavbar";
import { FaCheckCircle, FaTimesCircle, FaTools, FaCertificate } from "react-icons/fa";

const makeApi = (token) =>
  axios.create({
    baseURL: "http://localhost:8000",
    headers: { Authorization: `Bearer ${token}` },
  });

const DIAGNOSTIC_CHECKLIST = [
  { id: "battery", label: "Battery Health", critical: true },
  { id: "screen", label: "Screen Condition", critical: true },
  { id: "camera", label: "Camera Functionality", critical: true },
  { id: "storage", label: "Storage & Performance", critical: true },
  { id: "buttons", label: "Buttons & Ports", critical: false },
  { id: "overall", label: "Overall Functionality", critical: true },
];

const StaffDiagnostics = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("staffToken");

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [results, setResults] = useState({});
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!token) navigate("/staff/login");
  }, [token, navigate]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const { data } = await makeApi(token).get("/api/submissions/admin/all/?status=APPROVED");
        setDevices(Array.isArray(data) ? data : data.results ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, [token]);

  const handleResultChange = (testId, passed) => {
    setResults(prev => ({ ...prev, [testId]: passed }));
  };

  const allCriticalPassed = () => {
    return DIAGNOSTIC_CHECKLIST
      .filter(t => t.critical)
      .every(t => results[t.id] === true);
  };

  const handleAction = async (action) => {
    if (!selectedDevice) return;

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        results: results,
        notes: notes,
        action: action   // CERTIFIED, REFURBISH, REJECTED
      };

      await makeApi(token).post(
        `/api/submissions/${selectedDevice.id}/diagnostics/`,
        payload
      );

      let successMsg = "";
      if (action === "CERTIFIED") {
        successMsg = `🎉 Device certified successfully! Certificate has been generated.`;
      } else if (action === "REFURBISH") {
        successMsg = `🔧 Device sent for refurbishment.`;
      } else if (action === "REJECTED") {
        successMsg = `❌ Device has been rejected.`;
      }

      setMessage({ type: "success", text: successMsg });

      // Refresh list
      setDevices(prev => prev.filter(d => d.id !== selectedDevice.id));
      setSelectedDevice(null);
      setResults({});
      setNotes("");

    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Failed to process action. Please check backend."
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffNavbar />

      <main className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Device Diagnostics</h1>
          <p className="text-gray-600 mb-8">Perform tests and decide the next step</p>

          {message.text && (
            <div className={`mb-6 p-4 rounded-xl ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Device List */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow p-4">
                <h2 className="font-semibold mb-4">Devices Ready for Diagnostics</h2>
                {loading ? <p className="text-center py-12">Loading...</p> : devices.length === 0 ? (
                  <p className="text-center py-12 text-gray-500">No devices pending diagnostics</p>
                ) : (
                  devices.map(device => (
                    <div
                      key={device.id}
                      onClick={() => setSelectedDevice(device)}
                      className={`p-4 mb-3 rounded-xl border cursor-pointer transition-all ${selectedDevice?.id === device.id ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <p className="font-semibold">{device.brand} {device.model}</p>
                      <p className="text-sm text-gray-500">{device.customer_name || device.customer_email}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Diagnostics Panel */}
            <div className="lg:col-span-7">
              {selectedDevice ? (
                <div className="bg-white rounded-2xl shadow p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    {selectedDevice.brand} {selectedDevice.model}
                  </h2>

                  {/* Checklist */}
                  <div className="space-y-4 mb-8">
                    {DIAGNOSTIC_CHECKLIST.map(test => (
                      <div key={test.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                        <span className="font-medium">{test.label}</span>
                        <div className="flex gap-3">
                          <button onClick={() => handleResultChange(test.id, true)}
                            className={`px-6 py-2 rounded-lg ${results[test.id] === true ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>
                            Pass
                          </button>
                          <button onClick={() => handleResultChange(test.id, false)}
                            className={`px-6 py-2 rounded-lg ${results[test.id] === false ? 'bg-red-600 text-white' : 'bg-white border'}`}>
                            Fail
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Diagnostic notes..."
                    className="w-full p-4 border rounded-xl mb-6"
                    rows={4}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => handleAction("CERTIFIED")}
                      disabled={submitting || !allCriticalPassed()}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
                    >
                      <FaCertificate /> Certify
                    </button>

                    <button
                      onClick={() => handleAction("REFURBISH")}
                      disabled={submitting}
                      className="bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
                    >
                      <FaTools /> Refurbish
                    </button>

                    <button
                      onClick={() => handleAction("REJECTED")}
                      disabled={submitting}
                      className="bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
                    >
                      <FaTimesCircle /> Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center border-2 border-dashed rounded-2xl">
                  <p>Select a device to begin diagnostics</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffDiagnostics;