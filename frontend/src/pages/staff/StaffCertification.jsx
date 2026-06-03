// src/pages/staff/StaffCertification.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StaffNavbar from "../../components/StaffNavbar";
import { FaCertificate, FaSave } from "react-icons/fa";

const makeApi = (token) =>
  axios.create({
    baseURL: "http://localhost:8000",
    headers: { Authorization: `Bearer ${token}` },
  });

const DEVICE_CATEGORIES = [
  "Smartphone", "Laptop", "Tablet", "Smartwatch", 
  "Desktop", "Gaming Console", "Headphones", "Camera", "Other"
];

const StaffCertification = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("staffToken");

  const [certifiedDevices, setCertifiedDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [finalNotes, setFinalNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!token) navigate("/staff/login");
  }, [token, navigate]);

  useEffect(() => {
    const fetchCertified = async () => {
      try {
        const { data } = await makeApi(token).get("/api/submissions/admin/all/?status=CERTIFIED");
        setCertifiedDevices(Array.isArray(data) ? data : data.results ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertified();
  }, [token]);

  const handlePublishToCatalog = async () => {
    if (!selected || !category || !price) {
      alert("Please select category and enter price");
      return;
    }

    setProcessing(true);
    try {
      await makeApi(token).post(`/api/submissions/${selected.id}/certify/`, {
        category: category,
        estimated_price: parseFloat(price),
        final_notes: finalNotes,
      });

      setSuccessMessage(`✅ ${selected.brand} ${selected.model} has been published to the catalog!`);

      setCertifiedDevices(prev => prev.filter(d => d.id !== selected.id));
      setSelected(null);
      setCategory("");
      setPrice("");
      setFinalNotes("");

    } catch (err) {
      alert(err.response?.data?.error || "Failed to publish to catalog");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffNavbar />

      <main className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Final Certification</h1>
            <p className="text-gray-600">Review certified devices and publish them to the public catalog</p>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: List */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow border border-gray-100">
                <div className="px-6 py-4 border-b bg-gray-50">
                  <h2 className="font-semibold">Certified Devices ({certifiedDevices.length})</h2>
                </div>
                <div className="p-4 max-h-[70vh] overflow-y-auto">
                  {loading ? (
                    <div className="text-center py-12">Loading...</div>
                  ) : certifiedDevices.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No certified devices pending</div>
                  ) : (
                    certifiedDevices.map(device => (
                      <div
                        key={device.id}
                        onClick={() => setSelected(device)}
                        className={`p-4 mb-3 rounded-xl border cursor-pointer transition-all ${
                          selected?.id === device.id ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <p className="font-semibold">{device.brand} {device.model}</p>
                        <p className="text-sm text-gray-500">Cert ID: {device.certificate_id}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-7">
              {selected ? (
                <div className="bg-white rounded-2xl shadow p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    Publish to Catalog • {selected.brand} {selected.model}
                  </h2>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Device Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-4 border rounded-xl">
                      <option value="">Select Category</option>
                      {DEVICE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Estimated Resale Price (₹)</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="45000" className="w-full p-4 border rounded-xl" />
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-medium mb-2">Final Notes</label>
                    <textarea value={finalNotes} onChange={(e) => setFinalNotes(e.target.value)} rows={4} className="w-full p-4 border rounded-xl" placeholder="Final remarks..." />
                  </div>

                  <button
                    onClick={handlePublishToCatalog}
                    disabled={processing || !category || !price}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2"
                  >
                    {processing ? "Publishing..." : "✅ Publish to Catalog"}
                  </button>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl">
                  <p className="text-gray-500">Select a certified device to publish</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffCertification;