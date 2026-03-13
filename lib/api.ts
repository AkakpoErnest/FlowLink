const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    errorCode: string;
    message: string;
    details?: any;
  };
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'API request failed');
  }

  return data;
}

// API functions
export const api = {
  // Payment Links
  createPaymentLink: (data: any) => apiRequest('/links', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getPaymentLink: (code: string) => apiRequest(`/links/${code}`),
  
  createPaymentIntent: (code: string, data: any) => apiRequest(`/links/${code}/intent`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  settlePayment: (code: string, data: any) => apiRequest(`/links/${code}/settle`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Risk & Compliance
  getRiskScore: (wallet: string) => apiRequest('/risk/score', {
    method: 'POST',
    body: JSON.stringify({ wallet }),
  }),

  getAttestations: (wallet: string) => apiRequest(`/attestations/${wallet}`),

  // Routing
  getRouteQuote: (data: any) => apiRequest('/route/quote', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

