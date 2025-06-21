import React, { useEffect, useState } from "react";
import MotionPageWrapper from "../components/common/MotionPage";
import { useTranslation } from "react-i18next";
import { Select } from "antd";
import { getServiceNames, getSystemSettingByServiceName, updateSystemSetting } from "../apis/settingApi";
import { SystemSetting } from "../types/settings/SystemSetting";
import { SystemSettingUpdate } from "../types/settings/SystemSettingUpdate";
import { toast } from "react-toastify";
const { Option } = Select;


const Setting: React.FC = () => {
    const { t } = useTranslation("setting");
    const [selectedServiceName, setSelectedServiceName] = useState("");
    const [serviceNames, setServiceNames] = useState<string[]>([]);
    const [systemSettings, setSystemSettings] = useState<SystemSetting[]>([]);
    const [loadSystemSettings, setLoadSystemSettings] = useState(false);
    const [loadingServiceName, setLoadingServiceName] = useState(false);
    const [saving, setSaving] = useState(false);
    const fetchServiceNames = async () => {
        setLoadingServiceName(true);
        const response = await getServiceNames();
        if (response) {
            setServiceNames(response);
            console.log(response);

            console.log("Service Names:", response[0]);
            setSelectedServiceName(response[0] || "");
        }
        setLoadingServiceName(false);
    };
    const fetchSystemSettings = async (serviceName: string) => {
        setLoadSystemSettings(true);
        const resposne = await getSystemSettingByServiceName(serviceName);
        if (resposne) {
            setSystemSettings(resposne);
        }
        setLoadSystemSettings(false);
    }
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const updates: SystemSettingUpdate[] = systemSettings.map(setting => ({
            key: setting.key,
            value: setting.value
        }));
        const response = await updateSystemSetting(updates);
        if (!response.isSuccess) {
            toast.error(response.message, { position: "top-right", autoClose: 1000 });
        }
        toast.success(t("saveSuccess", "Lưu thành công"), { position: "top-right", autoClose: 1000 });
        setSaving(false);
    };
    const handleServiceNameChange = (value: string) => {
        setSelectedServiceName(value);
    };
    useEffect(() => {
        fetchServiceNames();
    }, [])
    useEffect(() => {
        console.log("Selected Service Name:", selectedServiceName);

        if (selectedServiceName) {
            fetchSystemSettings(selectedServiceName);
        }

    }, [selectedServiceName]);
    const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newSettings = [...systemSettings];
        newSettings[index].value = e.target.value;
        setSystemSettings(newSettings);
    }
    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-gray-900">{t("settings")}</h1>
                </div>
                <form
                    onSubmit={handleSave}
                    className="bg-white rounded-2xl shadow p-8 max-w-xl mx-auto"
                >
                    {/* Service Name */}
                    <label className="block mb-2 font-medium text-gray-700">
                        {t("serviceName")}
                    </label>
                    <Select
                        value={selectedServiceName}
                        onChange={handleServiceNameChange}
                        disabled={loadingServiceName}
                        style={{ width: 510, height: 50 }}
                        optionLabelProp="label"
                        className="custom-select mb-4"
                    >
                        {serviceNames.map((service, id) => (

                            <Option key={id} value={service} label={service}>
                                {service}
                            </Option>
                        ))}
                    </Select>
                    {
                        loadSystemSettings ? (
                            <div className="flex justify-center items-center h-[400px]">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                            </div>
                        ) :
                            systemSettings.map((setting, index) => {
                                return (
                                    <div className="mb-6" key={setting.id}>
                                        <label className="block mb-2 font-medium text-gray-700">
                                            {setting.key}
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                                            value={setting.value}
                                            onChange={(e) => handleOnchange(e, index)}
                                        />
                                    </div>);
                            })}

                    <button
                        type="submit"
                        className={`w-full py-3 rounded-lg bg-blue-500 text-white font-semibold text-lg transition hover:bg-blue-600 duration-200 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={saving}
                    >
                        {t("save")}
                    </button>
                </form>
            </div>
        </MotionPageWrapper>
    );
};

export default Setting;