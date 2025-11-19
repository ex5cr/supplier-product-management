'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import ProductList from '@/components/ProductList';
import ProductForm from '@/components/ProductForm';
import SearchBar from '@/components/SearchBar';

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imagePath: string | null;
  supplierId: string;
  supplier: Supplier;
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const data = await api.getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const searchProducts = async () => {
        try {
          const data = await api.searchProducts(searchQuery);
          setProducts(data);
        } catch (error) {
          console.error('Search failed:', error);
        }
      };
      const timeoutId = setTimeout(searchProducts, 300);
      return () => clearTimeout(timeoutId);
    } else {
      fetchProducts();
    }
  }, [searchQuery]);

  const handleCreate = async (data: {
    name: string;
    description: string;
    price: number;
    supplierId: string;
  }) => {
    await api.createProduct(data);
    await fetchProducts();
    setShowForm(false);
  };

  const handleUpdate = async (data: {
    name: string;
    description: string;
    price: number;
    supplierId?: string;
  }) => {
    if (!editingProduct) return;
    await api.updateProduct(editingProduct.id, data);
    await fetchProducts();
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    setUploadingImage(true);
    try {
      await api.uploadProductImage(editingProduct.id, file);
      await fetchProducts();
      alert('Image uploaded successfully!');
    } catch (error: any) {
      alert(error.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your products and assign them to suppliers.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add product
            </button>
          )}
        </div>
      </div>

      {!showForm && (
        <div className="mt-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search products by name or supplier name..."
          />
        </div>
      )}

      {showForm ? (
        <div className="mt-8">
          <ProductForm
            product={editingProduct}
            suppliers={suppliers}
            onSubmit={editingProduct ? handleUpdate : handleCreate}
            onCancel={handleCancel}
          />
          {editingProduct && (
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Upload Product Image
              </h3>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageUpload}
                  disabled={uploadingImage || !editingProduct}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50"
                />
                {uploadingImage && (
                  <span className="text-sm text-gray-500">Uploading...</span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Accepted formats: JPG, JPEG, PNG (max 5MB)
              </p>
            </div>
          )}
          {!editingProduct && (
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <p className="text-sm text-gray-500">
                You can upload an image after creating the product by editing it.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8">
          <ProductList
            products={products}
            onEdit={handleEdit}
            apiUrl={API_URL}
          />
        </div>
      )}
    </div>
  );
}

