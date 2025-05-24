import { Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../common/DeleteConfirm";
import { toast } from "react-toastify";
import { useState } from "react";
import { deleteUser } from "../../apis/userApi";
import { User } from "../../types/user/User";


interface CustomerTableProps {
    customers: User[];
    refresh: () => void;
}
const CustomerTable: React.FC<CustomerTableProps> = ({ customers, refresh }) => {
    const { t } = useTranslation("user");
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const handleDeleteClick = (id: string) => {
        setSelectedCustomerId(id);
        setIsDeleteConfirmOpen(true);
    };
    const handleConfirmDelete = async () => {
        const response = await deleteUser(selectedCustomerId!);
        if (!response.isSuccess) {
            toast.error(response.message, {
                autoClose: 1000,
                position: "top-right",
            });
            return;
        }
        toast.success("Customer deleted successfully", {
            autoClose: 1000,
            position: "top-right",
        });
        refresh();
        setIsDeleteConfirmOpen(false);
    };
    const navigate = useNavigate();
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('avatar')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('fullName')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('address')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('email')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('phone')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('role')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('enable')}</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('action')}</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0">
                                        <img className="h-10 w-10 rounded-lg object-cover" src={customer.photo == null ? "https://res.cloudinary.com/djjbs0a2v/image/upload/v1747887269/default_ebfqam.png" : customer.photo} alt={customer.firstName} />
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{customer.firstName} {customer.lastName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{customer.address}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{customer.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{customer.phoneNumber}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{customer.role}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {customer.enabled ? 'Enabled' : 'Disabled'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => navigate(`/customers/edit/${customer.id}`)}
                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(customer.id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <DeleteConfirmationModal
                title='Delete Customer'
                isOpen={isDeleteConfirmOpen}
                onClose={() => { setIsDeleteConfirmOpen(false); }}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};
export default CustomerTable;