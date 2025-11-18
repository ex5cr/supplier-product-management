import { getToken, removeToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
  body?: any;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (response.status === 401) {
    // Token expired or invalid
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export const api = {
  // Auth
  register: (email: string, password: string) =>
    request<{ token: string; user: { id: string; email: string } }>(
      '/auth/register',
      {
        method: 'POST',
        body: { email, password },
      }
    ),

  login: (email: string, password: string) =>
    request<{ token: string; user: { id: string; email: string } }>(
      '/auth/login',
      {
        method: 'POST',
        body: { email, password },
      }
    ),

  // Suppliers
  getSuppliers: () =>
    request<
      Array<{
        id: string;
        name: string;
        email: string;
        phone: string;
        createdAt: string;
      }>
    >('/suppliers'),

  createSupplier: (data: { name: string; email: string; phone: string }) =>
    request<{
      id: string;
      name: string;
      email: string;
      phone: string;
      createdAt: string;
    }>('/suppliers', {
      method: 'POST',
      body: data,
    }),

  updateSupplier: (id: string, data: { name: string; email: string; phone: string }) =>
    request<{
      id: string;
      name: string;
      email: string;
      phone: string;
      createdAt: string;
    }>(`/suppliers/${id}`, {
      method: 'PUT',
      body: data,
    }),

  // Products
  getProducts: () =>
    request<
      Array<{
        id: string;
        name: string;
        description: string;
        price: number;
        imagePath: string | null;
        supplierId: string;
        supplier: {
          id: string;
          name: string;
          email: string;
          phone: string;
        };
        createdAt: string;
      }>
    >('/products'),

  createProduct: (data: {
    name: string;
    description: string;
    price: number;
    supplierId: string;
  }) =>
    request<{
      id: string;
      name: string;
      description: string;
      price: number;
      imagePath: string | null;
      supplierId: string;
      supplier: {
        id: string;
        name: string;
        email: string;
        phone: string;
      };
      createdAt: string;
    }>('/products', {
      method: 'POST',
      body: data,
    }),

  updateProduct: (
    id: string,
    data: {
      name: string;
      description: string;
      price: number;
      supplierId?: string;
    }
  ) =>
    request<{
      id: string;
      name: string;
      description: string;
      price: number;
      imagePath: string | null;
      supplierId: string;
      supplier: {
        id: string;
        name: string;
        email: string;
        phone: string;
      };
      createdAt: string;
    }>(`/products/${id}`, {
      method: 'PUT',
      body: data,
    }),

  uploadProductImage: (productId: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('productId', productId);

    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(`${API_URL}/products/upload`, {
      method: 'POST',
      headers,
      body: formData,
    }).then(async (response) => {
      if (response.status === 401) {
        removeToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Unauthorized');
      }
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Upload failed');
      }
      return response.json();
    });
  },

  searchProducts: (query: string) =>
    request<
      Array<{
        id: string;
        name: string;
        description: string;
        price: number;
        imagePath: string | null;
        supplierId: string;
        supplier: {
          id: string;
          name: string;
          email: string;
          phone: string;
        };
        createdAt: string;
      }>
    >(`/products/search?q=${encodeURIComponent(query)}`),
};

