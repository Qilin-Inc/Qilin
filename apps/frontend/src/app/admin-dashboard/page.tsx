'use client'
import React, { useState } from 'react';
import { AlertCircle, Ban, UserX } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Complaint {
  id: number;
  complainant: string;
  accused: string;
  reason: string;
  status: 'pending' | 'resolved';
}

const initialComplaints: Complaint[] = [
  { id: 1, complainant: 'User1', accused: 'User2', reason: 'Harassment', status: 'pending' },
  { id: 2, complainant: 'User3', accused: 'User4', reason: 'Spam', status: 'pending' },
];

const AdminPanel: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const handleAction = (action: 'ban' | 'suspend') => {
    if (selectedComplaint) {
      setComplaints(complaints.map(complaint =>
        complaint.id === selectedComplaint.id ? { ...complaint, status: 'resolved' } : complaint
      ));
      setSelectedComplaint(null);
      alert(`User ${selectedComplaint.accused} has been ${action === 'ban' ? 'banned' : 'suspended'}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel - User Complaints</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Complaints List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Complainant</TableHead>
                  <TableHead>Accused</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.map(complaint => (
                  <TableRow 
                    key={complaint.id} 
                    className={`cursor-pointer ${selectedComplaint?.id === complaint.id ? 'bg-blue-100' : ''}`}
                    onClick={() => setSelectedComplaint(complaint)}
                  >
                    <TableCell>{complaint.complainant}</TableCell>
                    <TableCell>{complaint.accused}</TableCell>
                    <TableCell>{complaint.reason}</TableCell>
                    <TableCell>{complaint.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Complaint Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedComplaint ? (
              <>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Complaint Details</AlertTitle>
                  <AlertDescription>
                    <p><strong>Complainant:</strong> {selectedComplaint.complainant}</p>
                    <p><strong>Accused:</strong> {selectedComplaint.accused}</p>
                    <p><strong>Reason:</strong> {selectedComplaint.reason}</p>
                    <p><strong>Status:</strong> {selectedComplaint.status}</p>
                  </AlertDescription>
                </Alert>
                <div className="mt-4 space-x-2">
                  <Button onClick={() => handleAction('ban')} variant="destructive">
                    <Ban className="mr-2 h-4 w-4" /> Ban User
                  </Button>
                  <Button onClick={() => handleAction('suspend')} variant="destructive">
                    <UserX className="mr-2 h-4 w-4" /> Suspend User
                  </Button>
                </div>
              </>
            ) : (
              <p>Select a complaint to view details and take action.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;