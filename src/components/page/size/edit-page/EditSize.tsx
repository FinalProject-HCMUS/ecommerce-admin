import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MotionPageWrapper from "../../../common/MotionPage";
import { getSizeById } from "../../../../apis/sizeApi";
import { Size } from "../../../../types/size/Size";
import { toast } from "react-toastify";

const EditSize: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState<Size>({
        name: "",
        minHeight: 0,
        id: "",
        maxHeight: 0,
        minWeight: 0,
        maxWeight: 0,
    });

    const fetchSizeById = async (id: string) => {
        const response = await getSizeById(id);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000 });
            return;
        }
        if (response.data) {
            setFormData(response.data);
        }
    };

    useEffect(() => {
        if (id) {
            fetchSizeById(id);
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "name" ? value : Number(value),
        }));
    };

    const handleSubmit = () => {
        const { name, minHeight, maxHeight, minWeight, maxWeight } = formData;

        if (!name || minHeight <= 0 || maxHeight <= 0 || minWeight <= 0 || maxWeight <= 0) {
            toast.error("Please fill in all fields with valid values.", { autoClose: 1000 });
            return;
        }
        if (minHeight > maxHeight) {
            toast.error("Minimum height cannot be greater than maximum height.", { autoClose: 1000 });
            return;
        }
        if (minWeight > maxWeight) {
            toast.error("Minimum weight cannot be greater than maximum weight.", { autoClose: 1000 });
            return;
        }

        // Submit the updated size data to the server
        console.log("Updated size:", formData);
        toast.success("Size updated successfully!", { autoClose: 1000 });
        navigate("/sizes");
    };

    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-gray-900">Edit Size</h1>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="space-y-6">
                        {/* Size Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Size Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter size name (e.g., S, M, L)"
                            />
                        </div>

                        {/* Height Range */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Height (cm)</label>
                                <input
                                    type="number"
                                    name="minHeight"
                                    value={formData.minHeight}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter minimum height"

                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Height (cm)</label>
                                <input
                                    type="number"
                                    name="maxHeight"
                                    value={formData.maxHeight}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter maximum height"
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Weight Range */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Weight (kg)</label>
                                <input
                                    type="number"
                                    name="minWeight"
                                    value={formData.minWeight}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter minimum weight"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Weight (kg)</label>
                                <input
                                    type="number"
                                    name="maxWeight"
                                    value={formData.maxWeight}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter maximum weight"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate("/sizes")}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </MotionPageWrapper>
    );
};

export default EditSize;