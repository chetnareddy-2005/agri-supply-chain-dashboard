import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ShoppingCart, TrendingUp, Package, Search, LogOut, Plus, Minus, Check, Clock, User } from 'lucide-react';
import { toast } from 'sonner';

const RetailerDashboard = ({ user, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);

  useEffect(() => {
    loadProducts();
    loadOrders();
    loadCart();
  }, [user.id]);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, categoryFilter, products]);

  const loadProducts = () => {
    const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(allProducts.filter(p => parseFloat(p.quantity) > 0));
  };

  const loadOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const retailerOrders = allOrders.filter(o => o.retailerId === user.id);
    setOrders(retailerOrders);
  };

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem(`cart_${user.id}`) || '[]');
    setCart(savedCart);
  };

  const saveCart = (newCart) => {
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(newCart));
    setCart(newCart);
  };

  const filterProducts = () => {
    let filtered = products;
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.farmerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    
    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      const newCart = cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      saveCart(newCart);
      toast.success('Quantity increased in cart');
    } else {
      const newCart = [...cart, {
        productId: product.id,
        product: product,
        quantity: 1
      }];
      saveCart(newCart);
      toast.success('Added to cart');
    }
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.productId !== productId);
    saveCart(newCart);
    toast.info('Removed from cart');
  };

  const updateCartQuantity = (productId, delta) => {
    const newCart = cart.map(item => {
      if (item.productId === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        if (newQuantity > parseFloat(item.product.quantity)) {
          toast.error('Quantity exceeds available stock');
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    saveCart(newCart);
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    const newOrder = {
      id: Date.now().toString(),
      retailerId: user.id,
      retailerName: user.name,
      items: cart,
      total: cart.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save order
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    allOrders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(allOrders));

    // Update product quantities and orders count
    const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    cart.forEach(cartItem => {
      const productIndex = allProducts.findIndex(p => p.id === cartItem.productId);
      if (productIndex !== -1) {
        allProducts[productIndex].quantity = (parseFloat(allProducts[productIndex].quantity) - cartItem.quantity).toString();
        allProducts[productIndex].orders = (allProducts[productIndex].orders || 0) + 1;
      }
    });
    localStorage.setItem('products', JSON.stringify(allProducts));

    // Clear cart
    saveCart([]);
    loadProducts();
    loadOrders();
    toast.success('Order placed successfully!');
  };

  const handleQuickOrder = () => {
    if (!selectedProduct || orderQuantity <= 0) return;

    if (orderQuantity > parseFloat(selectedProduct.quantity)) {
      toast.error('Quantity exceeds available stock');
      return;
    }

    const newOrder = {
      id: Date.now().toString(),
      retailerId: user.id,
      retailerName: user.name,
      items: [{
        productId: selectedProduct.id,
        product: selectedProduct,
        quantity: orderQuantity
      }],
      total: parseFloat(selectedProduct.price) * orderQuantity,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    allOrders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(allOrders));

    const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const productIndex = allProducts.findIndex(p => p.id === selectedProduct.id);
    if (productIndex !== -1) {
      allProducts[productIndex].quantity = (parseFloat(allProducts[productIndex].quantity) - orderQuantity).toString();
      allProducts[productIndex].orders = (allProducts[productIndex].orders || 0) + 1;
    }
    localStorage.setItem('products', JSON.stringify(allProducts));

    loadProducts();
    loadOrders();
    setShowOrderDialog(false);
    setSelectedProduct(null);
    setOrderQuantity(1);
    toast.success('Order placed successfully!');
  };

  const stats = [
    { title: 'Total Orders', value: orders.length, icon: <Package className="h-8 w-8 text-primary" />, color: 'bg-primary/10' },
    { title: 'Cart Items', value: cart.length, icon: <ShoppingCart className="h-8 w-8 text-secondary" />, color: 'bg-secondary/10' },
    { title: 'Total Spent', value: `₹${orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}`, icon: <TrendingUp className="h-8 w-8 text-accent" />, color: 'bg-accent/10' }
  ];

  const categories = ['all', ...new Set(products.map(p => p.category))].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Retailer Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome, {user.name}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button
                  variant="outline"
                  className="relative"
                  onClick={() => document.getElementById('cart-tab')?.click()}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </div>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="card-elevated animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className={`h-14 w-14 rounded-lg ${stat.color} flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="browse" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Browse Products
            </TabsTrigger>
            <TabsTrigger id="cart-tab" value="cart" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Cart ({cart.length})
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              My Orders ({orders.length})
            </TabsTrigger>
          </TabsList>

          {/* Browse Products */}
          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filter */}
            <Card className="card-elevated">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products, farmers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat === 'all' ? 'All Categories' : cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <Card className="card-elevated">
                <CardContent className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="card-elevated hover:shadow-lg transition-all group">
                    <CardContent className="p-0">
                      <div className="relative aspect-video overflow-hidden rounded-t-xl">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                          {product.category}
                        </Badge>
                      </div>
                      
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">{product.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                            <User className="h-3 w-3" />
                            <span>{product.farmerName}</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{product.description}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-primary">
                              ₹{product.price}
                              <span className="text-sm text-muted-foreground">/{product.unit}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Available: {product.quantity} {product.unit}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => addToCart(product)}
                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add to Cart
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedProduct(product);
                              setOrderQuantity(1);
                              setShowOrderDialog(true);
                            }}
                            className="flex-1"
                          >
                            Quick Order
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Cart */}
          <TabsContent value="cart">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Shopping Cart</CardTitle>
                <CardDescription>Review your items before placing order</CardDescription>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h3>
                    <p className="text-muted-foreground">Add products to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{item.product.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.product.farmerName}</p>
                          <p className="text-lg font-bold text-primary mt-1">
                            ₹{item.product.price} × {item.quantity} = ₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartQuantity(item.productId, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-semibold w-12 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartQuantity(item.productId, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromCart(item.productId)}
                            className="ml-2"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t border-border pt-4 mt-4">
                      <div className="flex items-center justify-between text-xl font-bold">
                        <span className="text-foreground">Total:</span>
                        <span className="text-primary">
                          ₹{cart.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0).toFixed(2)}
                        </span>
                      </div>
                      <Button
                        onClick={placeOrder}
                        className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                        size="lg"
                      >
                        <Check className="h-5 w-5 mr-2" />
                        Place Order
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>Track your previous orders</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No orders yet</h3>
                    <p className="text-muted-foreground">Start shopping to see your orders here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((order) => (
                      <Card key={order.id} className="border-2">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                              <Clock className="h-3 w-3 mr-1" />
                              {order.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-sm">
                                <span className="text-foreground">
                                  {item.product.name} × {item.quantity}
                                </span>
                                <span className="font-semibold text-foreground">
                                  ₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="border-t border-border mt-4 pt-4 flex items-center justify-between">
                            <span className="font-semibold text-foreground">Total:</span>
                            <span className="text-lg font-bold text-primary">₹{order.total.toFixed(2)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Quick Order Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Order</DialogTitle>
            <DialogDescription>Place an order for this product</DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-foreground">{selectedProduct.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedProduct.farmerName}</p>
                  <p className="text-lg font-bold text-primary">₹{selectedProduct.price}/{selectedProduct.unit}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="text-center w-24"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setOrderQuantity(orderQuantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Available: {selectedProduct.quantity} {selectedProduct.unit}</p>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="text-foreground">Total:</span>
                  <span className="text-primary">₹{(parseFloat(selectedProduct.price) * orderQuantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOrderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleQuickOrder} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Place Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RetailerDashboard;