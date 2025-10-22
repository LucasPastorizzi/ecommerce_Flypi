import React, { useState } from "react";
import {
  Search,
  Grid3X3,
  List,
  Zap,
  ShoppingCart as CartIcon,
  Plus,
  Minus,
  Trash2,
  Filter,
  Camera,
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
  image: string;
  category: string;
  stock: number;
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
  },
  {
    id: 2,
    name: "Produto Standard",
    price: 99.99,
    image: "bg-blue-500",
    category: "Eletrônicos",
    stock: 8,
  },
  {
    id: 3,
    name: "Produto Básico",
    price: 49.99,
    image: "bg-purple-500",
    category: "Acessórios",
    stock: 25,
  },
  {
    id: 4,
    name: "Produto Deluxe",
    price: 299.99,
    image: "bg-pink-500",
    category: "Premium",
    stock: 5,
  },
  {
    id: 5,
    name: "Produto Eco",
    price: 79.99,
    image: "bg-green-500",
    category: "Sustentável",
    stock: 20,
  },
  {
    id: 6,
    name: "Produto Pro",
    price: 149.99,
    image: "bg-orange-500",
    category: "Profissional",
    stock: 12,
  },
];

export default function VendorPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(initialMockProducts);
  const [isAddProductFormOpen, setIsAddProductFormOpen] = useState(false);

  const categories = ["Eletrônicos", "Acessórios", "Premium", "Sustentável", "Profissional"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
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
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts((prevProducts) => [...prevProducts, { ...newProduct, id: newId }]);
    setIsAddProductFormOpen(false);
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
              <Dialog open={isAddProductFormOpen} onOpenChange={setIsAddProductFormOpen}>
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
                  <AddProductForm categories={categories} onAddProduct={handleAddProduct} />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
                >
                  <div className={cn("h-40 flex items-center justify-center text-white text-4xl", product.image)}>
                    +
                  </div>
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
                <div
                  key={product.id}
                  className="bg-white rounded-lg p-4 flex items-center justify-between hover:shadow transition-shadow"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={cn("w-16 h-16 rounded flex items-center justify-center text-white text-2xl", product.image)}>
                      +
                    </div>
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
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
        {/* Cart Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-gray-900">Seu carrinho</h2>
            <span className="bg-teal-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {cartItems}
            </span>
          </div>
          {cartItems === 0 && (
            <p className="text-sm text-gray-500">Clique nos produtos para adicionar à venda.</p>
          )}
        </div>

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
    </div>
  );
}

interface AddProductFormProps {
  categories: string[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ categories, onAddProduct }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [promotionalPrice, setPromotionalPrice] = useState('');
  const [category, setCategory] = useState(categories[0] || '');
  const [tag, setTag] = useState('');
  const [description, setDescription] = useState('');
  const [productCode, setProductCode] = useState('');
  const [cost, setCost] = useState('');
  const [unit, setUnit] = useState('Unidade');
  const [currentStock, setCurrentStock] = useState('');
  const [minStock, setMinStock] = useState('');
  const [image, setImage] = useState('bg-gray-200'); // Placeholder for image

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct({
      name,
      price: parseFloat(price),
      image,
      category,
      stock: parseInt(currentStock),
    });
    // Reset form fields
    setName('');
    setPrice('');
    setPromotionalPrice('');
    setCategory(categories[0] || '');
    setTag('');
    setDescription('');
    setProductCode('');
    setCost('');
    setUnit('Unidade');
    setCurrentStock('');
    setMinStock('');
    setImage('bg-gray-200');
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg h-48">
          <Camera className="w-12 h-12 text-gray-400 mb-2" />
          <Label htmlFor="product-image" className="text-blue-600 cursor-pointer">Selecionar uma foto</Label>
          <Input id="product-image" type="file" className="hidden" onChange={(e) => { /* Handle file upload */ }} />
        </div>

        <div>
          <Label htmlFor="name">Nome do Produto</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="price">Preço de Venda</Label>
          <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="promotional-price">Preço promocional</Label>
          <Input id="promotional-price" type="number" value={promotionalPrice} onChange={(e) => setPromotionalPrice(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="category">Categoria</Label>
          <Select onValueChange={setCategory} value={category}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tag">Nome da etiqueta</Label>
          <Input id="tag" value={tag} onChange={(e) => setTag(e.target.value)} />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
        </div>
        <div>
          <Label htmlFor="product-code">Código do produto</Label>
          <Input id="product-code" value={productCode} onChange={(e) => setProductCode(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="cost">Custo</Label>
          <Input id="cost" type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="unit">Vender por</Label>
          <Select onValueChange={setUnit} value={unit}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Unidade">Unidade</SelectItem>
              <SelectItem value="Kg">Kg</SelectItem>
              <SelectItem value="Litro">Litro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="current-stock">Estoque atual</Label>
            <Input id="current-stock" type="number" value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="min-stock">Estoque mínimo</Label>
            <Input id="min-stock" type="number" value={minStock} onChange={(e) => setMinStock(e.target.value)} />
          </div>
        </div>
        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
          Salvar Produto
        </Button>
      </div>
    </form>
  );
};
