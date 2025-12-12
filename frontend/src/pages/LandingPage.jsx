import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Leaf, Users, TrendingUp, ShoppingCart, CheckCircle, ArrowRight, Menu, X, Sprout, Package, BarChart3 } from 'lucide-react';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Sprout className="h-8 w-8" />,
      title: 'Direct Connection',
      description: 'Connect farmers directly with retailers, eliminating middlemen and increasing profits for both sides.'
    },
    {
      icon: <Package className="h-8 w-8" />,
      title: 'Smart Inventory',
      description: 'Real-time inventory management helps farmers track stock levels and manage their produce efficiently.'
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Price Control',
      description: 'Farmers set their own prices while retailers get competitive rates for fresh, quality produce.'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Sales Tracking',
      description: 'Track sales, orders, and revenue in real-time with comprehensive analytics and insights.'
    }
  ];

  const benefits = [
    { text: 'No commission fees', icon: <CheckCircle className="h-5 w-5 text-success" /> },
    { text: 'Direct negotiation', icon: <CheckCircle className="h-5 w-5 text-success" /> },
    { text: 'Real-time updates', icon: <CheckCircle className="h-5 w-5 text-success" /> },
    { text: 'Secure payments', icon: <CheckCircle className="h-5 w-5 text-success" /> },
    { text: 'Quality assurance', icon: <CheckCircle className="h-5 w-5 text-success" /> },
    { text: '24/7 support', icon: <CheckCircle className="h-5 w-5 text-success" /> }
  ];

  const stats = [
    { value: '500+', label: 'Active Farmers' },
    { value: '300+', label: 'Retailers' },
    { value: '10K+', label: 'Products Listed' },
    { value: '₹5M+', label: 'Transactions' }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Organic Farmer',
      content: 'This platform helped me increase my profit margins by 40%. Direct connection with retailers changed my business!',
      avatar: 'RK'
    },
    {
      name: 'Priya Sharma',
      role: 'Retail Store Owner',
      content: 'Fresh produce at competitive prices. The inventory tracking feature saves me hours every week.',
      avatar: 'PS'
    },
    {
      name: 'Amit Patel',
      role: 'Vegetable Farmer',
      content: 'No more middlemen taking cuts. I can now set fair prices and connect directly with buyers.',
      avatar: 'AP'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-card/95 backdrop-blur-lg shadow-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">AgriConnect</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-foreground/80 hover:text-primary transition-colors">Features</a>
              <a href="#benefits" className="text-foreground/80 hover:text-primary transition-colors">Benefits</a>
              <a href="#testimonials" className="text-foreground/80 hover:text-primary transition-colors">Testimonials</a>
              <Link to="/login">
                <Button variant="ghost" className="text-foreground hover:text-primary">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-foreground hover:text-primary transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-3 animate-slide-up">
              <a href="#features" className="block text-foreground/80 hover:text-primary transition-colors py-2">Features</a>
              <a href="#benefits" className="block text-foreground/80 hover:text-primary transition-colors py-2">Benefits</a>
              <a href="#testimonials" className="block text-foreground/80 hover:text-primary transition-colors py-2">Testimonials</a>
              <Link to="/login" className="block">
                <Button variant="ghost" className="w-full">Login</Button>
              </Link>
              <Link to="/register" className="block">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 w-fit">
                Connecting Farmers & Retailers
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Trade Fresh Produce
                <span className="text-gradient block mt-2">Directly & Efficiently</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Eliminate middlemen, increase profits, and build direct relationships. Our platform connects farmers with retailers for seamless agricultural transactions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl group">
                    Start Trading Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Learn More
                  </Button>
                </a>
              </div>
            </div>

            <div className="relative animate-scale-in">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop"
                  alt="Farmer with fresh produce"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent"></div>
              </div>
              {/* Floating Card */}
              <Card className="absolute -bottom-6 -left-6 glass p-4 shadow-xl animate-float">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">40% Higher Profits</p>
                    <p className="text-xs text-muted-foreground">For Farmers</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <Badge className="bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Everything You Need for <span className="text-gradient">Seamless Trading</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make agricultural trading simple, transparent, and profitable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="card-elevated hover:scale-105 transition-all duration-300 cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="pt-6">
                  <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <Badge className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 w-fit">
                Why Choose Us
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Built for <span className="text-gradient">Farmers & Retailers</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our platform is designed specifically for agricultural trade, providing all the tools you need to succeed in the modern marketplace.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {benefit.icon}
                    <span className="text-sm text-foreground">{benefit.text}</span>
                  </div>
                ))}
              </div>
              <Link to="/register">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg mt-4">
                  Join Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <Card className="card-elevated p-6 space-y-2">
                  <Users className="h-8 w-8 text-primary" />
                  <h4 className="font-semibold text-foreground">For Farmers</h4>
                  <p className="text-sm text-muted-foreground">List produce, manage inventory, set your own prices</p>
                </Card>
                <Card className="card-elevated p-6 space-y-2 mt-8">
                  <ShoppingCart className="h-8 w-8 text-secondary" />
                  <h4 className="font-semibold text-foreground">For Retailers</h4>
                  <p className="text-sm text-muted-foreground">Browse products, place orders, track purchases</p>
                </Card>
                <Card className="card-elevated p-6 space-y-2 col-span-2">
                  <Leaf className="h-8 w-8 text-success" />
                  <h4 className="font-semibold text-foreground">Sustainable Trading</h4>
                  <p className="text-sm text-muted-foreground">Support local farmers and reduce food waste through efficient supply chain</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              What Our <span className="text-gradient">Community Says</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-elevated animate-slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="card-gradient p-8 sm:p-12 text-center space-y-6 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Ready to Transform Your Agricultural Business?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of farmers and retailers already trading on our platform. Get started today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl">
                  Register as Farmer
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg hover:shadow-xl">
                  Register as Retailer
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">AgriConnect</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering farmers and retailers through direct trade connections.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#benefits" className="hover:text-primary transition-colors">Benefits</a></li>
                <li><Link to="/register" className="hover:text-primary transition-colors">Register</Link></li>
                <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: support@agriconnect.com</li>
                <li>Phone: +91 98765 43210</li>
                <li>Address: Mumbai, India</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2024 AgriConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;