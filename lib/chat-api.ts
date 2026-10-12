import api from './api';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ChatSource {
  sourceNumber: number;
  chunkId: string;
  documentId: string;
  documentName: string;
  chunkIndex: number;
  text: string;
  score: number;
}

export interface ChatResponse {
  success: boolean;
  conversationId: string;
  question: string;
  answer: string;
  sources: ChatSource[];
  tokensUsed?: number;
  duration?: string;
}

export interface Conversation {
  _id: string;
  title: string;
  messageCount: number;
  lastMessageAt: string;
  createdAt: string;
}

export const chatApi = {
  async send(payload: {
    question: string;
    conversationId?: string;
    documentId?: string;
    topK?: number;
  }): Promise<ChatResponse> {
    const { data } = await api.post('/api/chat', payload);
    return data;
  },

  async listConversations(): Promise<{ conversations: Conversation[] }> {
    const { data } = await api.get('/api/conversations');
    return data;
  },

  async getConversation(id: string) {
    const { data } = await api.get(`/api/conversations/${id}`);
    return data;
  },

  async renameConversation(id: string, title: string) {
    const { data } = await api.patch(`/api/conversations/${id}`, { title });
    return data;
  },

  async deleteConversation(id: string) {
    const { data } = await api.delete(`/api/conversations/${id}`);
    return data;
  },
};

// ─── Streaming helper ───
export interface StreamCallbacks {
  onMeta?: (meta: { conversationId: string }) => void;
  onSources?: (sources: ChatSource[]) => void;
  onToken?: (token: string) => void;
  onDone?: (data: { sources: ChatSource[]; tokensUsed: number }) => void;
  onError?: (error: string) => void;
}

/**
 * Streams a chat response using fetch + ReadableStream.
 * Returns a function to abort the stream (like an EventSource close).
 */
export function streamChat(
  payload: {
    question: string;
    conversationId?: string;
    documentId?: string;
    topK?: number;
  },
  callbacks: StreamCallbacks
): () => void {
  const controller = new AbortController();
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text();
        callbacks.onError?.(`HTTP ${res.status}: ${text.slice(0, 200)}`);
        return;
      }

      if (!res.body) {
        callbacks.onError?.('No response body');
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE messages are separated by \n\n
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';

        for (const part of parts) {
          const lines = part.split('\n');
          let event = 'message';
          let dataLine = '';

          for (const line of lines) {
            if (line.startsWith('event: ')) {
              event = line.slice(7).trim();
            } else if (line.startsWith('data: ')) {
              dataLine = line.slice(6);
            }
          }

          if (!dataLine) continue;

          let data: any;
          try {
            data = JSON.parse(dataLine);
          } catch {
            continue;
          }

          if (event === 'meta') {
            callbacks.onMeta?.(data);
          } else if (event === 'sources') {
            callbacks.onSources?.(data.sources);
          } else if (event === 'token') {
            callbacks.onToken?.(data.token);
          } else if (event === 'done') {
            callbacks.onDone?.(data);
          } else if (event === 'error') {
            callbacks.onError?.(data.error);
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User clicked stop — that's fine, no error to report
        return;
      }
      callbacks.onError?.(err.message || 'Stream failed');
    }
  })();

  // Return abort function
  return () => controller.abort();
}