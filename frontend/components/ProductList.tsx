'use client';

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface ProductImage {
  id: string;
  path: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imagePath: string | null;
  primaryImageId: string | null;
  primaryImage?: ProductImage | null;
  images?: ProductImage[];
  supplierId: string;
  supplier: Supplier;
  createdAt: string;
}

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  apiUrl?: string;
}

export default function ProductList({
  products,
  onEdit,
  onDelete,
  apiUrl = 'http://localhost:3001',
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
        No products found. Create your first product to get started.
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {products.map((product) => (
          <li key={product.id}>
            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {(product.primaryImage?.path || product.imagePath) && (
                    <div className="flex-shrink-0">
                      <img
                        key={`${product.id}-${product.primaryImage?.id || product.imagePath}`}
                        className="h-16 w-16 object-cover rounded"
                        src={`${apiUrl}${product.primaryImage?.path || product.imagePath}`}
                        alt={product.name}
                        onError={(e) => {
                          const imagePath = product.primaryImage?.path || product.imagePath;
                          console.error('Image load error:', `${apiUrl}${imagePath}`);
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {product.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Supplier: {product.supplier.name}
                    </p>
                    {product.images && product.images.length > 0 && (
                      <p className="mt-1 text-xs text-gray-400">
                        {product.images.length} image{product.images.length !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
                <div className="ml-2 flex-shrink-0 flex space-x-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

