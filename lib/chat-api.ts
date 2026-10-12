import api from './api';

export interface Conversation {
  _id: string;
  title: string;
  messageCount: number;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Source {
  sourceNumber: number;
  chunkId: string;
  documentId: string;
  documentName: string;
  chunkIndex: number;
  text: string;
  score: number;
}

export interface Message {
  _id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  createdAt: string;
}

export const chatApi = {
  async listConversations(): Promise<Conversation[]> {
    const { data } = await api.get('/api/conversations');
    return data.conversations;
  },

  async createConversation(title?: string): Promise<Conversation> {
    const { data } = await api.post('/api/conversations', {
      title: title || 'New conversation',
    });
    return data.conversation;
  },

  async getConversation(id: string): Promise<{
    conversation: Conversation;
    messages: Message[];
  }> {
    const { data } = await api.get(`/api/conversations/${id}`);
    return {
      conversation: data.conversation,
      messages: data.messages,
    };
  },

  async renameConversation(id: string, title: string): Promise<Conversation> {
    const { data } = await api.patch(`/api/conversations/${id}`, { title });
    return data.conversation;
  },

  async deleteConversation(id: string): Promise<void> {
    await api.delete(`/api/conversations/${id}`);
  },

  async sendMessage(payload: {
    question: string;
    conversationId?: string;
    topK?: number;
  }): Promise<{
    conversationId: string;
    answer: string;
    sources: Source[];
  }> {
    const { data } = await api.post('/api/chat', payload);
    return data;
  },
};