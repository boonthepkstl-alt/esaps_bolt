import { useState } from 'react';
import { UserPlus, ArrowRightLeft, Mail, MapPin, Briefcase, Package, ChevronRight, Check } from 'lucide-react';
import { Card, CardHeader, Button, Badge, StatusBadge, Avatar, Drawer, Select, Input, useToast, EmptyState } from '@/components/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { assets, employees, type Asset, type Employee } from '@/data/mockData';

interface AssignmentProps {
  onNavigate: (id: string, assetId?: string) => void;
}

export function Assignment({ onNavigate }: AssignmentProps) {
  const { push } = useToast();
  const [tab, setTab] = useState<'employees' | 'assets'>('employees');
  const [assignOpen, setAssignOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const assignedAssets = assets.filter((a) => a.status === 'Assigned');

  const assetColumns: Column<Asset>[] = [
    { key: 'name', header: 'Asset', sortable: true, sortValue: (r) => r.name, render: (r) => (
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-surface-100 flex items-center justify-center"><r.icon className="h-4 w-4 text-surface-500" /></div>
        <div><p className="font-medium text-surface-900">{r.name}</p><p className="text-caption text-surface-500">{r.code}</p></div>
      </div>
    ) },
    { key: 'assignedTo', header: 'Assigned To', sortable: true, sortValue: (r) => r.assignedTo ?? '', render: (r) => r.assignedTo ? (
      <div className="flex items-center gap-2"><Avatar initials={r.assignedTo.split(' ').map((n) => n[0]).join('').slice(0, 2)} size="xs" /><span>{r.assignedTo}</span></div>
    ) : <span className="text-surface-400">—</span> },
    { key: 'department', header: 'Department', sortable: true, sortValue: (r) => r.department, render: (r) => <span className="text-surface-600">{r.department}</span> },
    { key: 'location', header: 'Location', render: (r) => <span className="text-surface-600">{r.location}</span> },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button onClick={() => setTab('employees')} className={`px-4 py-2 rounded-md text-body font-medium transition-colors ${tab === 'employees' ? 'bg-brand-50 text-brand-700' : 'text-surface-600 hover:bg-surface-100'}`}>By Employee</button>
        <button onClick={() => setTab('assets')} className={`px-4 py-2 rounded-md text-body font-medium transition-colors ${tab === 'assets' ? 'bg-brand-50 text-brand-700' : 'text-surface-600 hover:bg-surface-100'}`}>By Asset</button>
      </div>

      {tab === 'employees' ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-body text-surface-500">{employees.length} employees with assigned assets</p>
            <Button size="sm" leftIcon={<UserPlus className="h-4 w-4" />} onClick={() => setAssignOpen(true)}>Assign Asset</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map((emp) => (
              <Card key={emp.id} className="p-5 hover:shadow-md transition-shadow cursor-pointer" >
                <div className="flex items-start gap-3">
                  <Avatar initials={emp.initials} color={emp.avatarColor} size="lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-title font-semibold text-surface-900 truncate">{emp.name}</p>
                    <p className="text-caption text-surface-500">{emp.title}</p>
                  </div>
                  <Badge variant="brand">{emp.assignedCount}</Badge>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="flex items-center gap-2 text-caption text-surface-600"><Mail className="h-3.5 w-3.5 text-surface-400" />{emp.email}</p>
                  <p className="flex items-center gap-2 text-caption text-surface-600"><Briefcase className="h-3.5 w-3.5 text-surface-400" />{emp.department}</p>
                  <p className="flex items-center gap-2 text-caption text-surface-600"><MapPin className="h-3.5 w-3.5 text-surface-400" />{emp.location}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => { setSelectedEmployee(emp); setTransferOpen(true); }} leftIcon={<ArrowRightLeft className="h-3.5 w-3.5" />}>Transfer</Button>
                  <Button variant="ghost" size="sm" onClick={() => setAssignOpen(true)}>Assign</Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <DataTable
          columns={assetColumns}
          data={assignedAssets}
          searchable
          searchPlaceholder="Search assigned assets..."
          onRowClick={(row) => onNavigate('asset-detail', row.id)}
          rowActions={(row) => [
            { label: 'View Details', icon: <ChevronRight className="h-4 w-4" />, onClick: () => onNavigate('asset-detail', row.id) },
            { label: 'Transfer', icon: <ArrowRightLeft className="h-4 w-4" />, onClick: () => { setSelectedAsset(row); setTransferOpen(true); } },
            { label: 'Unassign', icon: <UserPlus className="h-4 w-4" />, onClick: () => push({ variant: 'success', title: 'Asset unassigned', message: row.name }) },
          ]}
          emptyTitle="No assigned assets" emptyDescription="There are no assets currently assigned to employees."
        />
      )}

      {/* Assign Drawer */}
      <Drawer open={assignOpen} onClose={() => setAssignOpen(false)} title="Assign Asset" description="Select an asset and employee to create an assignment" footer={
        <>
          <Button variant="outline" onClick={() => setAssignOpen(false)}>Cancel</Button>
          <Button onClick={() => { push({ variant: 'success', title: 'Asset assigned', message: 'Assignment created successfully' }); setAssignOpen(false); }}>Confirm Assignment</Button>
        </>
      }>
        <div className="flex flex-col gap-4">
          <Select label="Asset" options={[{ value: '', label: 'Select asset' }, ...assets.filter((a) => a.status === 'Available').map((a) => ({ value: a.id, label: `${a.name} (${a.code})` }))]} />
          <Select label="Employee" options={[{ value: '', label: 'Select employee' }, ...employees.map((e) => ({ value: e.id, label: `${e.name} — ${e.title}` }))]} />
          <Input label="Assignment Date" type="date" />
          <Input label="Expected Return Date" type="date" helpText="Optional" />
          <Select label="Assignment Type" options={[
            { value: 'permanent', label: 'Permanent' },
            { value: 'temporary', label: 'Temporary' },
            { value: 'loan', label: 'Loan' },
          ]} />
        </div>
      </Drawer>

      {/* Transfer Wizard */}
      <Drawer open={transferOpen} onClose={() => setTransferOpen(false)} title="Transfer Asset" description={selectedAsset?.name ?? selectedEmployee?.name ?? ''} footer={
        <>
          <Button variant="outline" onClick={() => setTransferOpen(false)}>Cancel</Button>
          <Button onClick={() => { push({ variant: 'success', title: 'Transfer initiated', message: 'Asset transfer has been initiated' }); setTransferOpen(false); }}>Confirm Transfer</Button>
        </>
      }>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-50 border border-surface-200">
            <div className="h-10 w-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center"><Package className="h-5 w-5" /></div>
            <div><p className="text-body font-medium text-surface-900">{selectedAsset?.name ?? 'Select an asset'}</p><p className="text-caption text-surface-500">{selectedAsset?.code}</p></div>
          </div>
          <div className="flex items-center justify-center text-surface-400"><ArrowRightLeft className="h-5 w-5" /></div>
          <Select label="From Employee" options={[{ value: '', label: 'Current holder' }, ...employees.map((e) => ({ value: e.id, label: e.name }))]} />
          <Select label="To Employee" options={[{ value: '', label: 'Select new holder' }, ...employees.map((e) => ({ value: e.id, label: e.name }))]} />
          <Input label="Transfer Date" type="date" />
          <Input label="Reason" placeholder="e.g. Department reorganization" />
        </div>
      </Drawer>
    </div>
  );
}
