import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
import { Leaf, ArrowLeft, Upload, User, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { toast } from 'sonner';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('farmer');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    businessName: '',
    description: '',
    document: null,
    documentPreview: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setFormData({
        ...formData,
        document: file,
        documentPreview: URL.createObjectURL(file)
      });
      toast.success('Document uploaded successfully');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.document) {
      toast.error('Please upload a document for verification');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const newUser = {
        id: Date.now().toString(),
        ...formData,
        role: activeTab,
        status: 'pending',
        registeredAt: new Date().toISOString(),
        document: formData.documentPreview // Store preview URL for demo
      };

      // Save to localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      toast.success('Registration submitted successfully! Admin will review and approve your account.');
      setLoading(false);
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen gradient-subtle py-12 px-4">
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="flex items-center justify-center mb-8">
          <Link to="/" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <Card className="card-elevated shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-foreground">Create Account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Register as a farmer or retailer to start trading
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="farmer" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Register as Farmer
                </TabsTrigger>
                <TabsTrigger value="retailer" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Register as Retailer
                </TabsTrigger>
              </TabsList>

              <TabsContent value="farmer">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Full Name *</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="focus-ring"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Email *</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="focus-ring"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>Phone Number *</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="focus-ring"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessName" className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Farm Name</span>
                      </Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        placeholder="Your farm name"
                        value={formData.businessName}
                        onChange={handleChange}
                        className="focus-ring"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Address *</span>
                    </Label>
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Enter your complete address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="focus-ring resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-foreground">
                      Farm Description (Optional)
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Tell us about your farm and produce"
                      value={formData.description}
                      onChange={handleChange}
                      className="focus-ring resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="document" className="flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Upload Document (ID Proof/Farm Certificate) *</span>
                    </Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <input
                        type="file"
                        id="document"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="document" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {formData.document ? formData.document.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG (max 5MB)</p>
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-foreground"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      'Submit Registration'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="retailer">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Full Name *</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="focus-ring"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Email *</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="focus-ring"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>Phone Number *</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="focus-ring"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessName" className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Store/Business Name *</span>
                      </Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        placeholder="Your store name"
                        value={formData.businessName}
                        onChange={handleChange}
                        required
                        className="focus-ring"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Store Address *</span>
                    </Label>
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Enter your store address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="focus-ring resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-foreground">
                      Business Description (Optional)
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Tell us about your retail business"
                      value={formData.description}
                      onChange={handleChange}
                      className="focus-ring resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="document" className="flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Upload Document (ID Proof/Business License) *</span>
                    </Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <input
                        type="file"
                        id="document"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="document" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {formData.document ? formData.document.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG (max 5MB)</p>
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-foreground"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      'Submit Registration'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Login here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;