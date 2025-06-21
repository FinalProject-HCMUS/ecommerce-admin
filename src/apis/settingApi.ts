import axios from "axios";
import { SystemSetting } from "../types/settings/SystemSetting";
import { SystemSettingUpdate } from "../types/settings/SystemSettingUpdate";
import { CustomResponse } from "../types/common/CustomResponse";

const API_URL = import.meta.env.VITE_API_URL;
export const getServiceNames = async (): Promise<string[]> => {
    try {
        const response = await axios.get<string[]>(`${API_URL}/system-settings/service-names`);
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}
export const getSystemSettingByServiceName = async (serviceName: string): Promise<SystemSetting[]> => {
    try {
        const response = await axios.get<SystemSetting[]>(`${API_URL}/system-settings`,
            {
                params:
                {
                    serviceName
                }
            }
        );
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}
export const updateSystemSetting = async (updates: SystemSettingUpdate[]): Promise<CustomResponse<string>> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.put<CustomResponse<string>>(`${API_URL}/system-settings`,
            {
                updates
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }
        );
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}

