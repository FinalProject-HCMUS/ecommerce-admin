import React, { useState, useEffect, useRef, useCallback } from 'react';

import MotionPageWrapper from '../components/common/MotionPage';
import { User } from '../types/user/User';
import type { Message } from '../types/message/Message';
import { Conversation } from '../types/message/Conversation';
import { getConversations, getMessagesByConversationId } from '../apis/messageApi';
import { toast } from 'react-toastify';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useAuth } from '../context/AuthContext';
import { Camera, X } from 'lucide-react';
import { uploadImages } from '../apis/imageApi';
import { useTranslation } from 'react-i18next';
const API_URL = import.meta.env.VITE_API_URL;
const Message: React.FC = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [conversationsPage, setConversationsPage] = useState(0);
    const conversationRef = useRef<HTMLDivElement | null>(null);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [conversationId, setConversationId] = useState('');
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();
    const stompClientRef = useRef<Client | null>(null);
    const size = import.meta.env.VITE_ITEMS_PER_PAGE;
    const { t } = useTranslation('message');

    const fetchConversations = useCallback(async () => {
        setLoadingConversations(true);
        const response = await getConversations(conversationsPage, size, search);
        setLoadingConversations(false);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000, position: "top-right" });
            return;
        }
        if (response.data) {
            setConversations(prev => {
                if (conversationsPage === 0) {
                    return response.data!.content;
                }
                const existingIds = new Set(prev.map(c => c.id));
                const newItems = response.data!.content.filter(c => !existingIds.has(c.id));
                return [...prev, ...newItems];
            });
            setConversations(prev => {
                if (conversationsPage === 0) {
                    return response.data!.content;
                }
                const existingIds = new Set(prev.map(c => c.id));
                const newItems = response.data!.content.filter(c => !existingIds.has(c.id));
                return [...prev, ...newItems];
            });
            if (conversationsPage + 1 >= response.data.totalPages) {
                setHasMore(false);
            }
        }
    }, [conversationsPage, size, search]);

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



    const handleSelectUser = async (user: User, conversationId: string) => {
        setSelectedUser(user);
        // Fetch messages for the selected user
        setLoadingMessages(true);
        const response = await getMessagesByConversationId(conversationId);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000, position: "top-right" });
            return;
        }
        setConversationId(conversationId);
        if (response.data) {
            setChatMessages(response.data);
            setLoadingMessages(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setSearch(searchInput);
            setConversationsPage(0);
            setHasMore(true);
            setConversations([]);
        }
    }
    // Auto-scroll to bottom function
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const socket = new SockJS(`${API_URL}/ws`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                stompClient.subscribe('/topic/conversation/' + conversationId, (response) => {
                    console.log('Message received');
                    const message: Message = JSON.parse(response.body);
                    setChatMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages, message];
                        return updatedMessages;
                    });
                    //update latest message in conversation
                    conversations.forEach((element, index) => {
                        if (element.id == conversationId) {
                            conversations[index].latestMessage = message;
                        }
                    })
                    // Auto-scroll to bottom when new message arrives
                    setTimeout(scrollToBottom, 100);
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });
        stompClient.activate();
        stompClientRef.current = stompClient;
        return () => {
            stompClient.deactivate();
        };
    }, [conversationId]);

    const handleSendMessage = () => {
        const stompClient = stompClientRef.current;
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: "/app/chat.sendMessage/" + conversationId,
                body: JSON.stringify({
                    content: newMessage,
                    userId: user?.id,
                    conversationId: conversationId,
                    messageType: 'TEXT'
                })
            });
        } else {
            console.error('Stomp client is not connected');
        }
        setNewMessage('');
        // Auto-scroll to bottom after sending message
        setTimeout(scrollToBottom, 100);
    };
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSendingMessage(true);
        const imageResponse = await uploadImages(files);
        if (!imageResponse.isSuccess) {
            toast.error(imageResponse.message, {
                autoClose: 1000,
                position: 'top-right',
            });
            return;
        }
        imageResponse.data!.forEach((url) => {
            const stompClient = stompClientRef.current;
            if (stompClient && stompClient.connected) {
                stompClient.publish({
                    destination: "/app/chat.sendMessage/" + conversationId,
                    body: JSON.stringify({
                        contentUrl: url,
                        userId: user?.id,
                        conversationId: conversationId,
                        messageType: 'IMAGE'
                    })
                });
            } else {
                console.error('Stomp client is not connected');
            }
        });
        setSendingMessage(false);
        // Auto-scroll to bottom after sending image
        setTimeout(scrollToBottom, 100);
    };

    // Auto-scroll when chat messages change
    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
        setSelectedImage('');
    };

    return (
        <MotionPageWrapper>
            <div className="flex-1 bg-gray-100 p-8">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">{t('messages')}</h1>
                </div>

                <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-1/3 border-r border-gray-200">
                        <div className="p-4">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => { setSearchInput(e.target.value) }}
                                onKeyDown={handleKeyDown}
                                placeholder={t('search')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        {conversations.length === 0 && !loadingConversations ? (
                            <div className="flex justify-center items-center h-[400px]">
                                <p className="text-gray-500">{t('noConversation')}</p>
                            </div>
                        ) : (
                            <div ref={conversationRef} className="overflow-y-auto h-[calc(90vh-200px)]">
                                {conversations.map((c) => (
                                    <div
                                        key={c.id}
                                        onClick={() => handleSelectUser(c.customer, c.id)}
                                        className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${selectedUser?.id === c.customer.id ? 'bg-gray-200' : ''}`}
                                    >
                                        <img
                                            src={c.customer.photo || 'https://res.cloudinary.com/djjbs0a2v/image/upload/v1747887269/default_ebfqam.png'}
                                            alt={c.customer.firstName}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="ml-4">
                                            <h4 className="text-sm font-medium text-gray-800">{c.customer.firstName} {c.customer.lastName}</h4>
                                            <p className="text-xs text-gray-500">
                                                {c.latestMessage ? c.latestMessage.content : t('noMessage')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {/* Loading spinner at the bottom */}
                                {loadingConversations && (
                                    <div role="status" className="flex justify-center items-center py-4">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-solid"></div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Chat Window */}
                    <div className="w-2/3 flex flex-col h-[700px]">
                        {selectedUser ? (
                            <>
                                {/* Chat Header */}
                                <div className="flex items-center p-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
                                    <img
                                        src={selectedUser.photo || 'https://res.cloudinary.com/djjbs0a2v/image/upload/v1747887269/default_ebfqam.png'}
                                        alt={selectedUser.firstName}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="ml-4">
                                        <h4 className="text-sm font-medium text-gray-800">{selectedUser.firstName}</h4>
                                        {/* <p className="text-xs text-gray-500">Online - Last seen, 2:02pm</p> */}
                                    </div>
                                </div>

                                {/* Chat Messages */}
                                {loadingMessages || sendingMessage ? <div role="status" className="flex justify-center items-center flex-1">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                                </div> : <div className="flex-1 overflow-y-auto p-4 bg-gray-50 min-h-0">
                                    {chatMessages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.userId === user?.id ? 'justify-end' : 'justify-start'
                                                } mb-4`}
                                        >
                                            {message.messageType == "IMAGE" ? <img
                                                src={message.contentUrl}
                                                alt="attachment"
                                                className="mt-2 max-w-xs rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                                onClick={() => handleImageClick(message.contentUrl!)}
                                            /> : <div
                                                className={`px-4 py-2 rounded-lg ${message.userId === user?.id
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 text-gray-800'
                                                    }`}
                                            >
                                                {message.content}
                                            </div>}
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>}
                                {/* Chat Input */}
                                <div className="p-2 bg-gray-50 border-t border-gray-200 flex items-center flex-shrink-0">
                                    <div className="flex flex-col items-center">
                                        <Camera
                                            onClick={() => document.getElementById('image-upload')?.click()}
                                            className="text-gray-500 cursor-pointer mx-2" size={20} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id='image-upload'
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={t('typePlaceholder')}
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
                                        {t('send')}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center flex-1">
                                <p className="text-gray-500">{t('noSelectedConversation')}</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Image Modal */}
            {isImageModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
                    <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden">
                        <button
                            onClick={closeImageModal}
                            className="absolute top-6 right-6 text-white hover:text-gray-300 z-20 bg-black bg-opacity-70 rounded-full p-3"
                        >
                            <X size={36} />
                        </button>
                        <img
                            src={selectedImage}
                            alt="Full size"
                            className="max-w-[95vw] max-h-[95vh] object-contain"
                            style={{ imageRendering: 'crisp-edges' }}
                        />
                    </div>
                    <div
                        className="absolute inset-0 -z-10"
                        onClick={closeImageModal}
                    ></div>
                </div>
            )}
        </MotionPageWrapper >
    );
};

export default Message;