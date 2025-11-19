'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import ProductList from '@/components/ProductList';
import ProductForm from '@/components/ProductForm';
import SearchBar from '@/components/SearchBar';
import ConfirmationModal from '@/components/ConfirmationModal';
import AlertModal from '@/components/AlertModal';

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
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; variant: 'error' | 'success' | 'info' }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'info',
  });
  const [deleting, setDeleting] = useState(false);
  // Get base URL without /api suffix for static file serving
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
    : 'http://localhost:3001';

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
    supplierId: string;
  }) => {
    if (!editingProduct) return;
    // Always include supplierId in update
    const updatedProduct = await api.updateProduct(editingProduct.id, {
      ...data,
      supplierId: data.supplierId,
    });
    // Refresh products list to get updated supplier information
    await fetchProducts();
    // Close form after successful update
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

  const handleDeleteClick = (id: string) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.id) return;

    setDeleting(true);
    try {
      await api.deleteProduct(deleteModal.id);
      await fetchProducts();
      setDeleteModal({ isOpen: false, id: null });
      setAlertModal({
        isOpen: true,
        title: 'Success',
        message: 'Product deleted successfully.',
        variant: 'success',
      });
    } catch (error: any) {
      const errorMessage = error.message || error.error || 'Failed to delete product';
      setDeleteModal({ isOpen: false, id: null });
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: errorMessage,
        variant: 'error',
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, id: null });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    setUploadingImage(true);
    try {
      const result = await api.uploadProductImage(editingProduct.id, file);
      // Update the editing product with the new image path
      if (result.product) {
        setEditingProduct(result.product);
      }
      // Refresh products list to show the image
      await fetchProducts();
      setAlertModal({
        isOpen: true,
        title: 'Success',
        message: 'Image uploaded successfully!',
        variant: 'success',
      });
    } catch (error: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: error.message || 'Image upload failed',
        variant: 'error',
      });
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
            onDelete={handleDeleteClick}
            apiUrl={API_BASE_URL}
          />
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        variant="danger"
        loading={deleting}
      />

      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        variant={alertModal.variant}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
      />
    </div>
  );
}

