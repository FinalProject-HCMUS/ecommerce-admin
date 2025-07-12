import { SystemSetting } from "../types/settings/SystemSetting";
import { SystemSettingUpdate } from "../types/settings/SystemSettingUpdate";
import { CustomResponse } from "../types/common/CustomResponse";
import apiClient from "./axiosConfig";

export const getServiceNames = async (): Promise<string[]> => {
    try {
        const response = await apiClient.get<string[]>(`/system-settings/service-names`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || [];
    }
}

export const getSystemSettingByServiceName = async (serviceName: string): Promise<SystemSetting[]> => {
    try {
        const response = await apiClient.get<SystemSetting[]>(`/system-settings`, {
            params: { serviceName }
        });
        return response.data;
    } catch (error: any) {
        return error.response?.data || [];
    }
}

export const updateSystemSetting = async (updates: SystemSettingUpdate[]): Promise<CustomResponse<string>> => {
    try {
        const response = await apiClient.put<CustomResponse<string>>(`/system-settings`, { updates });
        return response.data;
    } catch (error: any) {
        return error.response?.data || { isSuccess: false, message: 'Network error' };
    }
}