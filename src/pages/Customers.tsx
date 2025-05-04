import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MotionPageWrapper from "../components/common/MotionPage";
import Pagination from "../components/common/Pagination";
import CustomerTable from "../components/customer/CustomerTable";
import { Plus } from "lucide-react";
import DeleteConfirmationModal from "../components/common/DeleteConfirm";
import EditCustomerModal from "../components/customer/EditCustomerModal";
import AddCustomerModal from "../components/customer/AddCustomerModal";
import { User } from "../types/customer/User";
import { deleteUser, getUsers, updateUser } from "../apis/userApi";
import { UserRequest } from "../types/customer/UserRequest";
import { UserCreateRequest } from "../types/customer/UserCreateRequest";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = import.meta.env.VITE_ITEMS_PER_PAGE;
const Customers = () => {
    const [customers, setCustomers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<any | undefined>();
    const [customerToDelete, setCustomerToDelete] = useState<User | null>(null);
    const { t } = useTranslation();
    const fetchCustomers = async (page: number) => {
        const response = await getUsers(page - 1, ITEMS_PER_PAGE);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000 });
            return;
        }
        if (response.data) {
            setCustomers(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        }
    }
    useEffect(() => {
        fetchCustomers(currentPage);
    }, [currentPage])

    const handleEdit = (id: string) => {
        const customer = customers.find(p => p.id === id);
        setSelectedCustomer(customer);
        setIsEditModalOpen(true);
    };
    const handleDelete = (id: string) => {
        const customer = customers.find(p => p.id == id);
        setCustomerToDelete(customer!);
    };
    const confirmDelete = async () => {
        if (customerToDelete) {
            const response = await deleteUser(customerToDelete.id);
            if (!response.isSuccess) {
                toast.error(response.message, { autoClose: 1000 });
                return;
            }
            fetchCustomers(currentPage);
            toast.success('Customer deleted successfully', { autoClose: 1000 });
            setCustomerToDelete(null);
        }
    };
    const handleAddCustomer = (customerData: UserCreateRequest) => {
        console.log(customerData);
        toast.success('Customer added successfully', { autoClose: 1000 });
    };
    const handleUpdateCustomer = async (updatedCustomer: UserRequest) => {
        const idUser = selectedCustomer?.id;
        const response = await updateUser(idUser, updatedCustomer);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000 });
            return;
        }
        fetchCustomers(currentPage);
        toast.success('Customer updated successfully', { autoClose: 1000 });
    };
    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">{t('customerSidebar')}</h1>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        <span>{t('addCustomer')}</span>
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <CustomerTable
                        customers={customers}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
                <AddCustomerModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddCustomer}
                />
                <EditCustomerModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleUpdateCustomer}
                    user={selectedCustomer}
                />
                <DeleteConfirmationModal
                    isOpen={!!customerToDelete}
                    onClose={() => setCustomerToDelete(null)}
                    onConfirm={confirmDelete}
                    itemName={customerToDelete?.id || ''}
                />
            </div>
        </MotionPageWrapper>
    )
}
export default Customers;