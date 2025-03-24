import { useEffect, useState } from "react";
import { getUsers } from "../apis/userApi";
import { User } from "../types";
import { toast } from "react-toastify";
import MotionPageWrapper from "../components/common/MotionPage";
import Pagination from "../components/common/Pagination";
import CustomerTable from "../components/customer/CustomerTable";
import { Plus } from "lucide-react";
import DeleteConfirmationModal from "../components/common/DeleteConfirm";
import EditCustomerModal from "../components/customer/EditCustomerModal";
import AddCustomerModal from "../components/customer/AddCustomerModal";

const ITEMS_PER_PAGE = 10;
const Customers = () => {
    const [customers, setCustomers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<User | undefined>();
    const [customerToDelete, setCustomerToDelete] = useState<User | null>(null);
    useEffect(() => {
        getUsers().then((data) => {
            setCustomers(data);
        });
    }, []);
    const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE);
    const getCurrentPageCustomers = () => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return customers.slice(start, end);
    };
    const handleEdit = (id: string) => {
        const customer = customers.find(p => p.id === id);
        setSelectedCustomer(customer);
        setIsEditModalOpen(true);
    };
    const handleDelete = (id: string) => {
        const customer = customers.find(p => p.id == id);
        setCustomerToDelete(customer!);
    };
    const confirmDelete = () => {
        if (customerToDelete) {
            const updatedCustomers = customers.filter(p => p.id !== customerToDelete.id);
            setCustomers(updatedCustomers);
            toast.success('Customer deleted successfully', { autoClose: 1000 });
            setCustomerToDelete(null);
        }
    };
    const handleAddCustomer = (customerData: Omit<User, 'id'>) => {
        const newCustomer: User = {
            id: (customers.length + 1).toString(),
            firstName: customerData.firstName,
            lastName: customerData.lastName,
            email: customerData.email,
            address: customerData.address,
            role: customerData.role,
            enabled: customerData.enabled,
            photo: customerData.photo,
            weight: customerData.weight,
            height: customerData.height,
            phoneNum: customerData.phoneNum,
            password: customerData.password,
        };
        setCustomers([...customers, newCustomer]);
        toast.success('Customer added successfully', { autoClose: 1000 });
    };
    const handleUpdateCustomer = (updatedCustomer: User) => {
        const updatedCustomers = customers.map((customer) =>
            customer.id === updatedCustomer.id ? updatedCustomer : customer
        );
        setCustomers(updatedCustomers);
        toast.success('Customer updated successfully', { autoClose: 1000 });
    };
    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        <span>Add Customer</span>
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <CustomerTable
                        customers={getCurrentPageCustomers()}
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