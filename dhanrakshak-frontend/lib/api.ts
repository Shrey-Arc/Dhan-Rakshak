// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dhanrakshak-backend.onrender.com';

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = ${API_BASE_URL}${endpoint};
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (token) {
    defaultHeaders['Authorization'] = Bearer ${token};
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Handle PDF responses
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/pdf')) {
      const blob = await response.blob();
      
      // Auto-download PDF
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'tax_integrity_certificate.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      
      return {
        success: true,
        isPDF: true,
        message: 'Certificate downloaded successfully',
        recordId: response.headers.get('X-Record-Id'),
        txHash: response.headers.get('X-Transaction-Hash'),
      };
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || HTTP error! status: ${response.status});
    }
    
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

export const api = {
  async healthCheck() {
    return apiCall('/health');
  },

  async loginWithGoogle(idToken: string) {
    const response = await apiCall('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken }),
    });

    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async submitData(extractedData: any) {
    return apiCall('/submit', {
      method: 'POST',
      body: JSON.stringify({ extractedData }),
    });
  },

  async verifyData(extractedData: any) {
    return apiCall('/verify', {
      method: 'POST',
      body: JSON.stringify({ extractedData }),
    });
  },

  async getRecord(recordId: string) {
    return apiCall(/record/${recordId});
  },

  async getRecords(page = 1, limit = 10) {
    return apiCall(/records?page=${page}&limit=${limit});
  },
};

export default api;
