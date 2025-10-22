import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Grid3X3,
  List,
  ShoppingCart as CartIcon,
  Plus,
  Minus,
  Trash2,
  Filter,
  Camera,
  Pencil,
  ShoppingBag,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Product {
  id: number;
  name: string;
  price: number;
  promotionalPrice?: number;
  image: string;
  category: string;
  stock: number;
  tag?: string;
  description?: string;
  productCode?: string;
  cost?: number;
  unit?: string;
  minStock?: number;
}

interface CartItem extends Product {
  quantity: number;
}

const initialMockProducts: Product[] = [
  {
    id: 1,
    name: "Produto Premium",
    price: 199.99,
    image: "bg-teal-500",
    category: "Eletrônicos",
    stock: 15,
    description: "Um produto premium de alta qualidade.",
    productCode: "PP001",
    cost: 100.00,
    unit: "Unidade",
    minStock: 5,
  },
  {
    id: 2,
    name: "Produto Standard",
    price: 99.99,
    image: "bg-blue-500",
    category: "Eletrônicos",
    stock: 8,
    description: "Um produto padrão e confiável.",
    productCode: "PS002",
    cost: 50.00,
    unit: "Unidade",
    minStock: 3,
  },
  {
    id: 3,
    name: "Produto Básico",
    price: 49.99,
    image: "bg-purple-500",
    category: "Acessórios",
    stock: 25,
    description: "Um acessório essencial para o dia a dia.",
    productCode: "PB003",
    cost: 20.00,
    unit: "Unidade",
    minStock: 10,
  },
  {
    id: 4,
    name: "Produto Deluxe",
    price: 299.99,
    image: "bg-pink-500",
    category: "Premium",
    stock: 5,
    description: "Uma versão deluxe com funcionalidades extras.",
    productCode: "PD004",
    cost: 150.00,
    unit: "Unidade",
    minStock: 2,
  },
  {
    id: 5,
    name: "Produto Eco",
    price: 79.99,
    image: "bg-green-500",
    category: "Sustentável",
    stock: 20,
    description: "Produto ecológico, amigo do meio ambiente.",
    productCode: "PE005",
    cost: 40.00,
    unit: "Unidade",
    minStock: 8,
  },
  {
    id: 6,
    name: "Produto Pro",
    price: 149.99,
    image: "bg-orange-500",
    category: "Profissional",
    stock: 12,
    description: "Ideal para uso profissional.",
    productCode: "PP006",
    cost: 70.00,
    unit: "Unidade",
    minStock: 5,
  },
];

export default function VendorPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem("products");
    return savedProducts ? JSON.parse(savedProducts) : initialMockProducts;
  });
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(true); // Estado para responsividade do carrinho

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const categories = ["Eletrônicos", "Acessórios", "Premium", "Sustentável", "Profissional"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory; // Lógica de filtro corrigida
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const handleAddProduct = (newProductData: Omit<Product, 'id'>) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts((prevProducts) => [...prevProducts, { ...newProductData, id: newId }]);
    setIsAddModalOpen(false);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setIsEditModalOpen(false);
    setProductToEdit(null);
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));
  };

  const openEditModal = (product: Product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search and Filters */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Nome ou código"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* Botão Adicionar Produto */}
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="w-4 h-4" />
                    Adicionar Produto
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] p-6 bg-neutral-800 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Cadastrar Produto</DialogTitle>
                  </DialogHeader>
                  <ProductForm categories={categories} onSave={handleAddProduct} productToEdit={null} />
                </DialogContent>
              </Dialog>
              {/* Botão Editar Produto (Modal) */}
              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[800px] p-6 bg-neutral-800 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Editar Produto</DialogTitle>
                  </DialogHeader>
                  <ProductForm
                    categories={categories}
                    onSave={handleUpdateProduct}
                    productToEdit={productToEdit}
                  />
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Categorias
              </Button>
            </div>

            {/* Categories and View Controls */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    !selectedCategory
                      ? "bg-slate-700 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  Todos
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      selectedCategory === category
                        ? "bg-slate-700 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className="flex-1 overflow-auto p-6">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <CartIcon className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-500">Tente ajustar seus filtros ou busca</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow group relative">
                  {/* Botões de Ação */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button size="icon" variant="outline" className="h-8 w-8 bg-white" onClick={() => openEditModal(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeleteProduct(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Imagem do Produto */}
                  {product.image.startsWith("blob:") || product.image.startsWith("http" ) ? (
                    <img src={product.image} alt={product.name} className="h-40 w-full object-cover" />
                  ) : (
                    <div className={cn("h-40 flex items-center justify-center text-white text-4xl", product.image)}>
                      +
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">{product.category}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-gray-900">R$ {product.price.toFixed(2)}</span>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {product.stock} em estoque
                      </span>
                    </div>
                    <Button
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                      size="sm"
                      onClick={() => addToCart(product)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg p-4 flex items-center justify-between hover:shadow transition-shadow group relative">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Imagem do Produto na Lista */}
                    {product.image.startsWith("blob:") || product.image.startsWith("http" ) ? (
                      <img src={product.image} alt={product.name} className="w-16 h-16 rounded object-cover" />
                    ) : (
                      <div className={cn("w-16 h-16 rounded flex items-center justify-center text-white text-2xl", product.image)}>
                        +
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">R$ {product.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{product.stock} em estoque</p>
                    </div>
                    {/* Botões de Ação na Lista */}
                    <Button size="icon" variant="outline" className="h-8 w-8 bg-white" onClick={() => openEditModal(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeleteProduct(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      className="bg-teal-500 hover:bg-teal-600 text-white"
                      size="sm"
                      onClick={() => addToCart(product)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Shopping Cart Sidebar */}
      <div className={cn(
        "w-80 bg-white border-l border-gray-200 flex-shrink-0 flex-col overflow-hidden transition-all duration-300 ease-in-out",
        isCartSidebarOpen ? "flex" : "hidden",
        "md:flex" // Sempre visível em telas maiores que 'md'
      )}>
        {/* Cart Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-lg font-bold text-gray-900">Seu carrinho</h2>
            <span className="bg-teal-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ml-2">
              {cartItems}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsCartSidebarOpen(false)} className="md:hidden"> {/* Botão de fechar visível apenas em telas menores */}
            <X className="h-4 w-4" />
          </Button>
        </div>

        {cartItems === 0 && (
          <p className="text-sm text-gray-500 p-6">Clique nos produtos para adicionar à venda.</p>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <CartIcon className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">Seu carrinho está vazio.</p>
              <p className="text-xs text-gray-400 mt-1">Clique nos produtos para adicionar à venda.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-xs text-gray-500">R$ {item.price.toFixed(2)} / un.</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-medium text-gray-900">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">R$ {cartTotal.toFixed(2)}</span>
            </div>
            <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white text-lg py-3">
              Finalizar Venda
            </Button>
          </div>
        )}
      </div>
      {/* Botão para abrir o carrinho em telas menores */}
      {!isCartSidebarOpen && (
        <div className="absolute bottom-4 right-4 md:hidden">
          <Button size="icon" className="h-12 w-12 rounded-full bg-teal-500 hover:bg-teal-600 text-white shadow-lg" onClick={() => setIsCartSidebarOpen(true)}>
            <ShoppingBag className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
}

// --- Componente do Formulário de Produto (Reutilizável) ---
interface ProductFormProps {
  categories: string[];
  onSave: (product: Product | Omit<Product, 'id'>) => void;
  productToEdit?: Product | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ categories, onSave, productToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    promotionalPrice: '',
    category: categories[0] || '',
    tag: '',
    description: '',
    productCode: '',
    cost: '',
    unit: 'Unidade',
    currentStock: '',
    minStock: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        price: String(productToEdit.price),
        promotionalPrice: productToEdit.promotionalPrice ? String(productToEdit.promotionalPrice) : '',
        category: productToEdit.category,
        tag: productToEdit.tag || '',
        description: productToEdit.description || '',
        productCode: productToEdit.productCode || '',
        cost: productToEdit.cost ? String(productToEdit.cost) : '',
        unit: productToEdit.unit || 'Unidade',
        currentStock: String(productToEdit.stock),
        minStock: productToEdit.minStock ? String(productToEdit.minStock) : '',
      });
      if (productToEdit.image.startsWith('blob:') || productToEdit.image.startsWith('http' )) {
        setImagePreview(productToEdit.image);
      } else {
        setImagePreview(null); // Clear preview if it's a default color class
      }
    } else {
      // Reset form when adding a new product
      setFormData({
        name: '', price: '', promotionalPrice: '', category: categories[0] || '', tag: '',
        description: '', productCode: '', cost: '', unit: 'Unidade', currentStock: '', minStock: '',
      });
      setImagePreview(null);
    }
  }, [productToEdit, categories]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData: Product | Omit<Product, 'id'> = {
      name: formData.name,
      price: parseFloat(formData.price),
      promotionalPrice: formData.promotionalPrice ? parseFloat(formData.promotionalPrice) : undefined,
      image: imagePreview || (productToEdit?.image || 'bg-gray-500'),
      category: formData.category,
      stock: parseInt(formData.currentStock),
      tag: formData.tag || undefined,
      description: formData.description || undefined,
      productCode: formData.productCode || undefined,
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
      unit: formData.unit || undefined,
      minStock: formData.minStock ? parseInt(formData.minStock) : undefined,
    };

    if (productToEdit) {
      onSave({ ...submissionData, id: productToEdit.id } as Product);
    } else {
      onSave(submissionData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Coluna da Esquerda (Imagem e campos principais) */}
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-lg h-48 bg-neutral-700">
          {imagePreview ? (
            <img src={imagePreview} alt="Pré-visualização" className="h-full w-full object-contain rounded-lg" />
          ) : (
            <Camera className="w-12 h-12 text-gray-400 mb-2" />
          )}
          <Label htmlFor="product-image" className="text-blue-400 cursor-pointer mt-2">Selecionar uma foto</Label>
          <Input id="product-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </div>

        <div>
          <Label htmlFor="name">Nome do Produto</Label>
          <Input id="name" value={formData.name} onChange={handleInputChange} required className="bg-neutral-700 text-white border-gray-600" />
        </div>
        <div>
          <Label htmlFor="price">Preço de Venda</Label>
          <Input id="price" type="number" value={formData.price} onChange={handleInputChange} required className="bg-neutral-700 text-white border-gray-600" />
        </div>
        <div>
          <Label htmlFor="promotionalPrice">Preço promocional</Label>
          <Input id="promotionalPrice" type="number" value={formData.promotionalPrice} onChange={handleInputChange} className="bg-neutral-700 text-white border-gray-600" />
        </div>
        <div>
          <Label htmlFor="category">Categoria</Label>
          <Select onValueChange={(value) => handleSelectChange('category', value)} value={formData.category}>
            <SelectTrigger className="w-full bg-neutral-700 text-white border-gray-600">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 text-white">
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tag">Nome da etiqueta</Label>
          <Input id="tag" value={formData.tag} onChange={handleInputChange} className="bg-neutral-700 text-white border-gray-600" />
        </div>
      </div>

      {/* Coluna da Direita (Outros campos) */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea id="description" value={formData.description} onChange={handleInputChange} rows={4} className="bg-neutral-700 text-white border-gray-600" />
        </div>
        <div>
          <Label htmlFor="productCode">Código do produto</Label>
          <Input id="productCode" value={formData.productCode} onChange={handleInputChange} className="bg-neutral-700 text-white border-gray-600" />
        </div>
        <div>
          <Label htmlFor="cost">Custo</Label>
          <Input id="cost" type="number" value={formData.cost} onChange={handleInputChange} className="bg-neutral-700 text-white border-gray-600" />
        </div>
        <div>
          <Label htmlFor="unit">Vender por</Label>
          <Select onValueChange={(value) => handleSelectChange('unit', value)} value={formData.unit}>
            <SelectTrigger className="w-full bg-neutral-700 text-white border-gray-600">
              <SelectValue placeholder="Selecione a unidade" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 text-white">
              <SelectItem value="Unidade">Unidade</SelectItem>
              <SelectItem value="Kg">Kg</SelectItem>
              <SelectItem value="Litro">Litro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="currentStock">Estoque atual</Label>
            <Input id="currentStock" type="number" value={formData.currentStock} onChange={handleInputChange} required className="bg-neutral-700 text-white border-gray-600"/>
          </div>
          <div>
            <Label htmlFor="minStock">Estoque mínimo</Label>
            <Input id="minStock" type="number" value={formData.minStock} onChange={handleInputChange} className="bg-neutral-700 text-white border-gray-600"/>
          </div>
        </div>
        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
          {productToEdit ? 'Salvar Alterações' : 'Salvar Produto'}
        </Button>
      </div>
    </form>
  );
};
