import api from './api';

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

export interface SearchResults {
  documents: SearchResult[];
  conversations: SearchResult[];
  members: SearchResult[];
}

export const searchApi = {
  async global(q: string): Promise<SearchResults> {
    if (!q || q.trim().length < 2) {
      return { documents: [], conversations: [], members: [] };
    }
    const { data } = await api.get(
      `/api/search?q=${encodeURIComponent(q.trim())}`
    );
    return data.results;
  },
};
