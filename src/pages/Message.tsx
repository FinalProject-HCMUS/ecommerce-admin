import React, { useState, useEffect } from 'react';

import MotionPageWrapper from '../components/common/MotionPage';
import { User } from '../types/user/User';
import type { Message } from '../types/message/Message';

const Message: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {

    }, []);

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
    };

    const handleSendMessage = () => {

    };

    return (
        <h1>message</h1>
        // <MotionPageWrapper>
        //     <div className="flex-1 bg-gray-100 p-8">
        //         {/* Header */}
        //         <div className="mb-8 flex justify-between items-center">
        //             <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
        //         </div>

        //         <div className="flex bg-white rounded-lg shadow overflow-hidden">
        //             {/* Sidebar */}
        //             <div className="w-1/3 border-r border-gray-200">
        //                 <div className="p-4">
        //                     <input
        //                         type="text"
        //                         placeholder="Search"
        //                         className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        //                     />
        //                 </div>
        //                 <div className="overflow-y-auto h-[calc(90vh-200px)]">
        //                     {users.map((user) => (
        //                         <div
        //                             key={user.id}
        //                             onClick={() => handleSelectUser(user)}
        //                             className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${selectedUser?.id === user.id ? 'bg-gray-200' : ''
        //                                 }`}
        //                         >
        //                             <img
        //                                 src={user.photo || './images/user.png'}
        //                                 alt={user.firstName}
        //                                 className="w-10 h-10 rounded-full object-cover"
        //                             />
        //                             <div className="ml-4">
        //                                 <h4 className="text-sm font-medium text-gray-800">{user.firstName}</h4>
        //                                 <p className="text-xs text-gray-500">
        //                                     {messages
        //                                         .filter(
        //                                             (message) =>
        //                                                 message.customer_id === user.id || message.admin_id === user.id
        //                                         )
        //                                         .slice(-1)[0]?.content || 'No messages yet'}
        //                                 </p>
        //                             </div>
        //                         </div>
        //                     ))}
        //                 </div>
        //             </div>

        //             {/* Chat Window */}
        //             <div className="w-2/3 flex flex-col h-[600px]">
        //                 {selectedUser ? (
        //                     <>
        //                         {/* Chat Header */}
        //                         <div className="flex items-center p-4 bg-gray-50 border-b border-gray-200">
        //                             <img
        //                                 src={selectedUser.photo || './images/user.png'}
        //                                 alt={selectedUser.firstName}
        //                                 className="w-10 h-10 rounded-full object-cover"
        //                             />
        //                             <div className="ml-4">
        //                                 <h4 className="text-sm font-medium text-gray-800">{selectedUser.firstName}</h4>
        //                                 <p className="text-xs text-gray-500">Online - Last seen, 2:02pm</p>
        //                             </div>
        //                         </div>

        //                         {/* Chat Messages */}
        //                         <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        //                             {chatMessages.map((message) => (
        //                                 <div
        //                                     key={message.id}
        //                                     className={`flex ${message.role_chat === 'ADMIN' ? 'justify-end' : 'justify-start'
        //                                         } mb-4`}
        //                                 >
        //                                     <div
        //                                         className={`px-4 py-2 rounded-lg ${message.role_chat === 'ADMIN'
        //                                             ? 'bg-blue-600 text-white'
        //                                             : 'bg-gray-200 text-gray-800'
        //                                             }`}
        //                                     >
        //                                         {message.content}
        //                                     </div>
        //                                 </div>
        //                             ))}
        //                         </div>

        //                         {/* Chat Input */}
        //                         <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center">
        //                             <input
        //                                 type="text"
        //                                 placeholder="Type a message..."
        //                                 value={newMessage}
        //                                 onChange={(e) => setNewMessage(e.target.value)}
        //                                 onKeyDown={(e) => {
        //                                     if (e.key === "Enter")
        //                                         handleSendMessage();
        //                                 }
        //                                 }
        //                                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
        //                             />
        //                             <button
        //                                 onClick={handleSendMessage}
        //                                 className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        //                             >
        //                                 Send
        //                             </button>
        //                         </div>
        //                     </>
        //                 ) : (
        //                     <div className="flex items-center justify-center flex-1">
        //                         <p className="text-gray-500">Select a conversation to start chatting</p>
        //                     </div>
        //                 )}
        //             </div>
        //         </div>
        //     </div>
        // </MotionPageWrapper>
    );
};

export default Message;