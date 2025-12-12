import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Users, ShoppingBag, CheckCircle, XCircle, Eye, LogOut, Mail, Phone, MapPin, FileText, Clock } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = ({ user, onLogout }) => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    setPendingUsers(users.filter(u => u.status === 'pending'));
    setApprovedUsers(users.filter(u => u.status === 'approved'));
  };

  const handleApprove = (userId) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      const tempPassword = `Temp@${Math.random().toString(36).slice(-6)}`;
      users[userIndex].status = 'approved';
      users[userIndex].tempPassword = tempPassword;
      users[userIndex].password = tempPassword;
      users[userIndex].approvedAt = new Date().toISOString();
      
      localStorage.setItem('users', JSON.stringify(users));
      
      toast.success(
        `User approved! Temporary password: ${tempPassword}\n(In production, this would be sent via email)`,
        { duration: 8000 }
      );
      
      loadUsers();
    }
  };

  const handleReject = (userId) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    toast.info('User registration rejected');
    loadUsers();
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsDialog(true);
  };

  const stats = [
    { title: 'Pending Approvals', value: pendingUsers.length, icon: <Clock className="h-8 w-8 text-secondary" />, color: 'bg-secondary/10' },
    { title: 'Total Farmers', value: approvedUsers.filter(u => u.role === 'farmer').length, icon: <Users className="h-8 w-8 text-primary" />, color: 'bg-primary/10' },
    { title: 'Total Retailers', value: approvedUsers.filter(u => u.role === 'retailer').length, icon: <ShoppingBag className="h-8 w-8 text-accent" />, color: 'bg-accent/10' },
    { title: 'All Users', value: approvedUsers.length, icon: <CheckCircle className="h-8 w-8 text-success" />, color: 'bg-success/10' }
  ];

  const UserCard = ({ user: cardUser, isPending }) => (
    <Card className="card-elevated hover:shadow-lg transition-all">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                {cardUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-foreground">{cardUser.name}</h4>
                <Badge variant={cardUser.role === 'farmer' ? 'default' : 'secondary'} className="text-xs">
                  {cardUser.role}
                </Badge>
              </div>
              
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Mail className="h-3 w-3" />
                  <span>{cardUser.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-3 w-3" />
                  <span>{cardUser.phone}</span>
                </div>
                {cardUser.businessName && (
                  <div className="flex items-center space-x-2">
                    <FileText className="h-3 w-3" />
                    <span>{cardUser.businessName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => viewUserDetails(cardUser)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          
          {isPending && (
            <>
              <Button
                size="sm"
                onClick={() => handleApprove(cardUser.id)}
                className="bg-success text-success-foreground hover:bg-success/90 flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleReject(cardUser.id)}
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage user registrations and platform</p>
            </div>
            <Button
              variant="outline"
              onClick={onLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* User Management Tabs */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Review and approve user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Pending ({pendingUsers.length})
                </TabsTrigger>
                <TabsTrigger value="farmers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Farmers ({approvedUsers.filter(u => u.role === 'farmer').length})
                </TabsTrigger>
                <TabsTrigger value="retailers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Retailers ({approvedUsers.filter(u => u.role === 'retailer').length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {pendingUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No pending registrations</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {pendingUsers.map((user) => (
                      <UserCard key={user.id} user={user} isPending={true} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="farmers" className="space-y-4">
                {approvedUsers.filter(u => u.role === 'farmer').length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No approved farmers yet</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {approvedUsers.filter(u => u.role === 'farmer').map((user) => (
                      <UserCard key={user.id} user={user} isPending={false} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="retailers" className="space-y-4">
                {approvedUsers.filter(u => u.role === 'retailer').length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No approved retailers yet</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {approvedUsers.filter(u => u.role === 'retailer').map((user) => (
                      <UserCard key={user.id} user={user} isPending={false} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* User Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Complete information about the user</DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xl">
                    {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedUser.name}</h3>
                  <Badge variant={selectedUser.role === 'farmer' ? 'default' : 'secondary'}>
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-semibold text-muted-foreground">Email</Label>
                  <p className="text-foreground">{selectedUser.email}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-semibold text-muted-foreground">Phone</Label>
                  <p className="text-foreground">{selectedUser.phone}</p>
                </div>
              </div>

              {selectedUser.businessName && (
                <div className="space-y-1">
                  <Label className="text-sm font-semibold text-muted-foreground">
                    {selectedUser.role === 'farmer' ? 'Farm Name' : 'Business Name'}
                  </Label>
                  <p className="text-foreground">{selectedUser.businessName}</p>
                </div>
              )}

              <div className="space-y-1">
                <Label className="text-sm font-semibold text-muted-foreground">Address</Label>
                <p className="text-foreground">{selectedUser.address}</p>
              </div>

              {selectedUser.description && (
                <div className="space-y-1">
                  <Label className="text-sm font-semibold text-muted-foreground">Description</Label>
                  <p className="text-foreground">{selectedUser.description}</p>
                </div>
              )}

              {selectedUser.document && (
                <div className="space-y-1">
                  <Label className="text-sm font-semibold text-muted-foreground">Uploaded Document</Label>
                  <div className="border border-border rounded-lg p-4">
                    {selectedUser.document.endsWith('.pdf') ? (
                      <p className="text-sm text-muted-foreground">PDF Document Uploaded</p>
                    ) : (
                      <img
                        src={selectedUser.document}
                        alt="Document"
                        className="max-h-64 object-contain rounded"
                      />
                    )}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="space-y-1">
                  <Label className="text-sm font-semibold text-muted-foreground">Registration Date</Label>
                  <p className="text-foreground text-sm">
                    {new Date(selectedUser.registeredAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-semibold text-muted-foreground">Status</Label>
                  <Badge variant={selectedUser.status === 'approved' ? 'default' : 'secondary'}>
                    {selectedUser.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedUser && selectedUser.status === 'pending' && (
              <div className="flex gap-2 w-full">
                <Button
                  onClick={() => {
                    handleApprove(selectedUser.id);
                    setShowDetailsDialog(false);
                  }}
                  className="bg-success text-success-foreground hover:bg-success/90 flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve User
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleReject(selectedUser.id);
                    setShowDetailsDialog(false);
                  }}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject User
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Label = ({ className, children }) => (
  <label className={className}>{children}</label>
);

export default AdminDashboard;