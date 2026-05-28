import React, { useState } from "react";
import { X, Upload, Loader2, ImagePlus } from "lucide-react";

const categories = [
  "Design",
  "Fashion",
  "Travel",
  "Food",
  "Technology",
  "Photography",
  "Architecture",
  "Art",
];

const CreatePinModal = ({ open, onClose, onSubmit }) => {
  // =========================================================
  // STATES
  // =========================================================
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    category: "",
    image: null,
  });

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // HANDLE IMAGE UPLOAD
  // =========================================================
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  // =========================================================
  // SUBMIT
  // =========================================================
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });

      await onSubmit(payload);

      // RESET FORM
      setFormData({
        title: "",
        description: "",
        link: "",
        category: "",
        image: null,
      });

      setPreview(null);
      onClose();
    } catch (error) {
      console.error("Create pin failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================
  if (!open) return null;

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 sm:p-6">
      {/* FIXED: Changed min-h to h-[720px] and added max-h-[90vh] 
        to ensure the modal never bleeds out of the viewport.
      */}
      <div className="relative bg-white w-full max-w-6xl rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 h-[720px] max-h-[90vh]">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-full bg-white hover:bg-gray-100 transition shadow-sm border border-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT SIDE */}
        {/* FIXED: Added overflow-y-auto to allow internal scrolling on mobile */}
        <div className="bg-gray-50 border-r border-gray-100 p-6 flex items-center justify-center overflow-y-auto">
          <div className="w-full h-full min-h-[400px] rounded-[28px] border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-white">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center text-center px-8 w-full h-full">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                  <ImagePlus className="w-10 h-10 text-gray-500" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900">
                  Upload your image
                </h3>

                <p className="text-gray-500 mt-3 max-w-sm leading-relaxed">
                  Choose a high-quality image to create your next amazing pin.
                </p>

                <div className="mt-8 px-6 py-3 rounded-full bg-black text-white font-medium hover:opacity-90 transition flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Select File
                </div>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        {/* FIXED: Added overflow-y-auto for independent scrolling of form elements */}
        <div className="p-8 lg:p-10 flex flex-col overflow-y-auto">
          <div className="mb-10 mt-4 lg:mt-0">
            <h2 className="text-4xl font-bold text-gray-900">Create Pin</h2>

            <p className="text-gray-500 mt-3">
              Share your creativity with the world. Because apparently the
              internet still needs more aesthetically arranged coffee photos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
            {/* TITLE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Add a title"
                required
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>

              <textarea
                rows={6}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell everyone what your Pin is about"
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none resize-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* LINK */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Destination Link
              </label>

              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black bg-white"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* ACTIONS */}
            <div className="mt-auto pt-6 pb-2 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold transition flex items-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Publish Pin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePinModal;