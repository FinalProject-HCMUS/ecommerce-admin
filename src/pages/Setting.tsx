import React, { useState } from "react";
import MotionPageWrapper from "../components/common/MotionPage";
import { useTranslation } from "react-i18next";

const services = [
    { value: "mysettings", label: "MySettings" },
    { value: "otherservice", label: "OtherService" },
];

const Setting: React.FC = () => {
    const { t } = useTranslation("setting");
    const [service, setService] = useState(services[0].value);
    const [usdToVnd, setUsdToVnd] = useState("24000");
    const [shippingFee, setShippingFee] = useState("abdhldggfjfjfhghjifbgh");
    const [productLimit, setProductLimit] = useState("150000");
    const [saving, setSaving] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        // TODO: Call API to save settings
        setTimeout(() => setSaving(false), 1000);
    };

    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-gray-900">{t("settingTitle", "Cài đặt")}</h1>
                </div>
                <form
                    onSubmit={handleSave}
                    className="bg-white rounded-2xl shadow p-8 max-w-xl mx-auto"
                >
                    {/* Service Name */}
                    <div className="mb-6">
                        <label className="block mb-2 font-medium text-gray-700">
                            {t("serviceName", "Tên dịch vụ")}
                        </label>
                        <div className="relative">
                            <select
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                                value={service}
                                onChange={(e) => setService(e.target.value)}
                            >
                                {services.map((s) => (
                                    <option key={s.value} value={s.value}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* USD-VND Rate */}
                    <div className="mb-6">
                        <label className="block mb-2 font-medium text-gray-700">
                            {t("usdToVnd", "Tỷ lệ chuyển đổi USD-VN")}
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                            value={usdToVnd}
                            onChange={(e) => setUsdToVnd(e.target.value)}
                        />
                    </div>
                    {/* Shipping Fee */}
                    <div className="mb-6">
                        <label className="block mb-2 font-medium text-gray-700">
                            {t("shippingFee", "Giá vận chuyển sản phẩm")}
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                            value={shippingFee}
                            onChange={(e) => setShippingFee(e.target.value)}
                        />
                    </div>
                    {/* Product Limit */}
                    <div className="mb-8">
                        <label className="block mb-2 font-medium text-gray-700">
                            {t("productLimit", "Giới hạn sản phẩm")}
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                            value={productLimit}
                            onChange={(e) => setProductLimit(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-blue-500 text-white font-semibold text-lg transition hover:bg-blue-600"
                        disabled={saving}
                    >
                        {t("save", "Lưu")}
                    </button>
                </form>
            </div>
        </MotionPageWrapper>
    );
};

export default Setting;