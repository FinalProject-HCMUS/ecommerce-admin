import React, { useState, useEffect, useRef, useCallback } from 'react';

import MotionPageWrapper from '../components/common/MotionPage';
import { User } from '../types/user/User';
import type { Message } from '../types/message/Message';
import { Conversation } from '../types/message/Conversation';
import { getConversations } from '../apis/messageApi';
import { toast } from 'react-toastify';

const Message: React.FC = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [conversationsPage, setConversationsPage] = useState(0);
    const conversationRef = useRef<HTMLDivElement | null>(null);
    const size = import.meta.env.VITE_ITEMS_PER_PAGE;

    const fetchConversations = useCallback(async () => {
        setLoadingConversations(true);
        const response = await getConversations(conversationsPage, size);
        setLoadingConversations(false);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000, position: "top-right" });
            return;
        }
        if (response.data) {
            // If first page, replace; else, append
            setConversations(prev =>
                conversationsPage === 0
                    ? response.data!.content
                    : [...prev, ...response.data!.content]
            );
            // If last page, stop loading more
            if (conversationsPage + 1 >= response.data.totalPages) {
                setHasMore(false);
            }
        }
    }, [conversationsPage, size]);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // Infinite scroll handler
    const handleScroll = useCallback(() => {
        const el = conversationRef.current;
        if (!el || loadingConversations || !hasMore) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
            setConversationsPage((prev) => prev + 1);
        }
    }, [loadingConversations, hasMore]);

    useEffect(() => {
        const el = conversationRef.current;
        if (!el) return;
        el.addEventListener('scroll', handleScroll);
        return () => {
            el.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);



    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
    };

    const handleSendMessage = () => {

    };

    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
                </div>

                <div className="flex bg-white rounded-lg shadow overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-1/3 border-r border-gray-200">
                        <div className="p-4">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        {loadingConversations ? (<div className="flex justify-center items-center h-[400px]">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                        </div>) : <div ref={conversationRef} className="overflow-y-auto h-[calc(90vh-200px)]">
                            {conversations.map((c) => (
                                <div
                                    key={c.id + 1}
                                    onClick={() => handleSelectUser(c.customer)}
                                    className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${selectedUser?.id === c.customer.id ? 'bg-gray-200' : ''
                                        }`}
                                >
                                    <img
                                        src={c.customer.photo || './images/user.png'}
                                        alt={c.customer.firstName}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="ml-4">
                                        <h4 className="text-sm font-medium text-gray-800">{c.customer.firstName}</h4>
                                        <p className="text-xs text-gray-500">
                                            {c.latestMessage ? c.latestMessage.content : 'No messages yet'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>}
                    </div>

                    {/* Chat Window */}
                    <div className="w-2/3 flex flex-col h-[600px]">
                        {selectedUser ? (
                            <>
                                {/* Chat Header */}
                                <div className="flex items-center p-4 bg-gray-50 border-b border-gray-200">
                                    <img
                                        src={selectedUser.photo || './images/user.png'}
                                        alt={selectedUser.firstName}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="ml-4">
                                        <h4 className="text-sm font-medium text-gray-800">{selectedUser.firstName}</h4>
                                        <p className="text-xs text-gray-500">Online - Last seen, 2:02pm</p>
                                    </div>
                                </div>

                                {/* Chat Messages */}
                                {/* <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                                    {chatMessages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.role_chat === 'ADMIN' ? 'justify-end' : 'justify-start'
                                                } mb-4`}
                                        >
                                            <div
                                                className={`px-4 py-2 rounded-lg ${message.role_chat === 'ADMIN'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 text-gray-800'
                                                    }`}
                                            >
                                                {message.content}
                                            </div>
                                        </div>
                                    ))}
                                </div> */}

                                {/* Chat Input */}
                                <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                                handleSendMessage();
                                        }
                                        }
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Send
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center flex-1">
                                <p className="text-gray-500">Select a conversation to start chatting</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MotionPageWrapper>
    );
};

export default Message;