import { useState, useEffect } from "react";
import axios from "axios";

const Warehouses = () => {
  const [showModal, setShowModal] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    warehouseId: "",
    name: "",
    location: "",
    supervisor: "",
    totalCapacity: "",
  });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/warehouses");
      setWarehouses(res.data);
    } catch (err) {
      console.error("❌ Error fetching warehouses:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // 🔄 Update existing warehouse
        await axios.put(`http://localhost:5050/api/warehouses/${editId}`, {
          ...formData,
          totalCapacity: Number(formData.totalCapacity),
        });
      } else {
        // ➕ Add new warehouse
        await axios.post("http://localhost:5050/api/warehouses/add", {
          ...formData,
          totalCapacity: Number(formData.totalCapacity),
        });
      }

      fetchWarehouses();
      setFormData({
        warehouseId: "",
        name: "",
        location: "",
        supervisor: "",
        totalCapacity: "",
      });
      setShowModal(false);
      setIsEditing(false);
      setEditId(null);
    } catch (error) {
      console.error("❌ Error saving warehouse:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5050/api/warehouses/${id}`);
      fetchWarehouses();
    } catch (err) {
      console.error("❌ Error deleting warehouse:", err);
    }
  };

  const handleEdit = (warehouse) => {
    setFormData({
      warehouseId: warehouse.warehouseId,
      name: warehouse.name,
      location: warehouse.location,
      supervisor: warehouse.supervisor,
      totalCapacity: warehouse.totalCapacity,
    });
    setIsEditing(true);
    setEditId(warehouse._id);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Warehouses</h2>
          <button
            onClick={() => {
              setShowModal(true);
              setIsEditing(false);
              setFormData({
                warehouseId: "",
                name: "",
                location: "",
                supervisor: "",
                totalCapacity: "",
              });
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Warehouse
          </button>
        </div>

        {/* 📦 Warehouse Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-indigo-100 text-indigo-800">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Supervisor</th>
                <th className="px-6 py-4">Capacity</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.length > 0 ? (
                warehouses.map((wh) => (
                  <tr key={wh._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{wh.warehouseId}</td>
                    <td className="px-6 py-4">{wh.name}</td>
                    <td className="px-6 py-4">{wh.location}</td>
                    <td className="px-6 py-4">{wh.supervisor}</td>
                    <td className="px-6 py-4">{wh.totalCapacity}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleEdit(wh)}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-700 text-white rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(wh._id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-700 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center px-6 py-10 text-gray-500 italic">
                    No warehouses added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🧾 Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">
                {isEditing ? "Edit Warehouse" : "Add New Warehouse"}
              </h3>
              <form onSubmit={handleSubmit}>
                {["warehouseId", "name", "location", "supervisor", "totalCapacity"].map((field) => (
                  <div className="mb-4" key={field}>
                    <label className="block text-sm font-medium mb-1 capitalize">
                      {field === "totalCapacity" ? "Total Capacity" : field}
                    </label>
                    <input
                      name={field}
                      type={field === "totalCapacity" ? "number" : "text"}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                      placeholder={`Enter ${field}`}
                      required
                    />
                  </div>
                ))}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setIsEditing(false);
                      setEditId(null);
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    {isEditing ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Warehouses;
