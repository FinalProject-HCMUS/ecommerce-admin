import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MotionPageWrapper from "../../../common/MotionPage";

const AddSize: React.FC = () => {
    const navigate = useNavigate();
    const [sizeName, setSizeName] = useState("");
    const [minHeight, setMinHeight] = useState<number | "">("");
    const [maxHeight, setMaxHeight] = useState<number | "">("");
    const [minWeight, setMinWeight] = useState<number | "">("");
    const [maxWeight, setMaxWeight] = useState<number | "">("");

    const handleSubmit = () => {
        if (!sizeName || minHeight === "" || maxHeight === "" || minWeight === "" || maxWeight === "") {
            alert("Please fill in all fields.");
            return;
        }
        if (minHeight > maxHeight) {
            alert("Minimum height cannot be greater than maximum height.");
            return;
        }
        if (minWeight > maxWeight) {
            alert("Minimum weight cannot be greater than maximum weight.");
            return;
        }
        // Submit the size data to the server
        console.log("Submitting size:", { sizeName, minHeight, maxHeight, minWeight, maxWeight });
        navigate("/sizes"); // Navigate back to the sizes page
    };

    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-gray-900">Add Size</h1>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="space-y-6">
                        {/* Size Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Size Name</label>
                            <input
                                type="text"
                                value={sizeName}
                                onChange={(e) => setSizeName(e.target.value)}
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
                                    value={minHeight}
                                    onChange={(e) => setMinHeight(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter minimum height"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Height (cm)</label>
                                <input
                                    type="number"
                                    value={maxHeight}
                                    onChange={(e) => setMaxHeight(Number(e.target.value))}
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
                                    value={minWeight}
                                    onChange={(e) => setMinWeight(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter minimum weight"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Weight (kg)</label>
                                <input
                                    type="number"
                                    value={maxWeight}
                                    onChange={(e) => setMaxWeight(Number(e.target.value))}
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

export default AddSize;