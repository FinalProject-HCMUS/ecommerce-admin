import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import MotionPageWrapper from "../../../common/MotionPage";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { changePassword } from "../../../../apis/userApi";
import { useAuth } from "../../../../context/AuthContext";
import { toast } from "react-toastify";


const ChangePassword: React.FC = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { t } = useTranslation('profile');
    const { user } = useAuth();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const getPasswordRules = () => [
        {
            label: t('minimumLength'),
            test: (pw: string) => pw.length >= 12,
        },
        {
            label: t('oneUppercase'),
            test: (pw: string) => /[A-Z]/.test(pw),
        },
        {
            label: t('oneLowercase'),
            test: (pw: string) => /[a-z]/.test(pw),
        },
        {
            label: t('oneSpecialChar'),
            test: (pw: string) => /[^A-Za-z0-9]/.test(pw),
        },
        {
            label: t('oneNumber'),
            test: (pw: string) => /\d/.test(pw),
        },
    ];

    const passwordRules = getPasswordRules();


    const isOldValid = oldPassword.length > 0;
    const ruleResults = passwordRules.map((rule) => rule.test(newPassword));
    const isNewValid = ruleResults.every(Boolean);
    const isConfirmValid = confirmPassword === newPassword && confirmPassword.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isNewValid || !isConfirmValid) {
            toast.error("Please ensure your new password meets all requirements.", { autoClose: 1000, position: "top-right" });
            return;
        }
        setSaving(true);
        const response = await changePassword(user!.id, oldPassword, newPassword, confirmPassword);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 2000, position: "top-right" });
            setSaving(false);
            return;
        }
        toast.success("Password changed successfully!", { autoClose: 1000, position: "top-right" });
        navigate("/about");
    };

    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-gray-900">{t('editProfile')}</h1>
                </div>
                <div className="max-w-xl mx-auto mt-8 bg-white rounded-2xl shadow p-8">
                    <h2 className="text-2xl font-bold mb-8">{t('changePassword')}</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Old Password */}
                        <div>
                            <label className="block mb-2 font-semibold">{t('oldPassword')}</label>
                            <div className={`relative`}>
                                <input
                                    type={showOld ? "text" : "password"}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${isOldValid ? "border-green-400" : "border-gray-300"}`}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    onClick={() => setShowOld((v) => !v)}
                                    tabIndex={-1}
                                >
                                    {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block mb-2 font-semibold">{t('newPassword')}</label>
                            <div className="relative">
                                <input
                                    type={showNew ? "text" : "password"}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${newPassword.length > 0 && !isNewValid ? "border-red-400" : newPassword.length > 0 && isNewValid ? "border-green-400" : "border-gray-300"}`}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    onClick={() => setShowNew((v) => !v)}
                                    tabIndex={-1}
                                >
                                    {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {newPassword.length > 0 && !isNewValid && (
                                <div className="mt-2 text-red-500 text-sm font-medium">
                                    {t('alertEnterPassword')}
                                </div>
                            )}
                            <ul className="mt-2 space-y-1 text-sm">
                                {passwordRules.map((rule, idx) => (
                                    <li
                                        key={rule.label}
                                        className={
                                            ruleResults[idx]
                                                ? "text-gray-400 line-through"
                                                : idx === ruleResults.findIndex((v) => !v)
                                                    ? "text-red-500 font-semibold"
                                                    : "text-gray-400"
                                        }
                                    >
                                        {rule.label}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <label className="block mb-2 font-semibold">{t('confirmPassword')}</label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    onClick={() => setShowConfirm((v) => !v)}
                                    tabIndex={-1}
                                >
                                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {confirmPassword.length > 0 && confirmPassword !== newPassword && (
                                <div className="mt-2 text-red-500 text-sm font-medium">
                                    {t('alertMatch')}
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    navigate(-1);
                                }}
                                className="mr-4 bg-gray-300 text-gray-700 px-8 py-2 rounded-full font-semibold hover:bg-gray-400 transition"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className={`bg-blue-600 text-white px-8 py-2 rounded-full font-semibold hover:bg-blue-700 transition ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={saving}
                            >
                                {t('save')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MotionPageWrapper>
    );
};

export default ChangePassword;