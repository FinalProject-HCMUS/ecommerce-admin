import { Message } from '../types';

export const getMessages = async (): Promise<Message[]> => {
    return [
        {
            id: '1',
            content: 'Xin chào, tôi cần hỗ trợ về đơn hàng của mình.',
            role_chat: 'CUSTOMER',
            customer_id: '1',
            admin_id: '2',
            created_At: '2025-03-29T10:00:00Z',
        },
        {
            id: '2',
            content: 'Chào bạn, tôi có thể giúp gì cho bạn?',
            role_chat: 'ADMIN',
            customer_id: '1',
            admin_id: '2',
            created_At: '2025-03-29T10:01:00Z',
        },
    ];
};
