import {
  Boxes,
  CheckCircle2,
  Wrench,
  AlertTriangle,
  KeyRound,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Wrench as WrenchIcon,
  UserCheck,
  ShoppingCart,
  KeyRound as KeyIcon,
  ClipboardCheck,
  ArrowRightLeft,
  Calendar,
  Clock,
  CheckCircle2 as CheckIcon,
} from 'lucide-react';
import { Card, CardHeader, Badge, StatusBadge, Button, Avatar, Progress } from '@/components/ui';
import { BarChart, DonutChart, ProgressBarChart } from '@/components/Charts';
import { kpis, assetLifecycleData, departmentDistribution, assetTypeDistribution, activities, approvals, assets, maintenanceRecords } from '@/data/mockData';
import { cn } from '@/lib/cn';

interface DashboardProps {
  onNavigate: (id: string) => void;
}

const kpiCards = [
  { label: 'Total Assets', value: kpis.totalAssets, icon: Boxes, color: 'brand', change: '+4.2%', trend: 'up', sub: 'across all locations' },
  { label: 'Available', value: kpis.available, icon: CheckCircle2, color: 'success', change: '+1.8%', trend: 'up', sub: 'ready to assign' },
  { label: 'Assigned', value: kpis.assigned, icon: UserCheck, color: 'accent', change: '+3.1%', trend: 'up', sub: 'in active use' },
  { label: 'In Maintenance', value: kpis.inMaintenance, icon: Wrench, color: 'warning', change: '-0.5%', trend: 'down', sub: 'under repair' },
  { label: 'Expired Warranty', value: kpis.expiredWarranty, icon: AlertTriangle, color: 'error', change: '+2.4%', trend: 'up', sub: 'needs attention' },
  { label: 'Software Licenses', value: kpis.softwareLicenses, icon: KeyRound, color: 'brand', change: '0%', trend: 'neutral', sub: '2 expiring soon' },
  { label: 'Monthly Depreciation', value: `$${(kpis.monthlyDepreciation / 1000).toFixed(1)}K`, icon: TrendingDown, color: 'accent', change: '+1.2%', trend: 'up', sub: 'current period' },
  { label: 'Monthly Cost', value: `$${(kpis.monthlyCost / 1000).toFixed(1)}K`, icon: DollarSign, color: 'success', change: '-0.8%', trend: 'down', sub: 'operational expense' },
];

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  brand: { bg: 'bg-brand-50', text: 'text-brand-600', ring: 'bg-brand-500' },
  success: { bg: 'bg-success-50', text: 'text-success-600', ring: 'bg-success-500' },
  warning: { bg: 'bg-warning-50', text: 'text-warning-600', ring: 'bg-warning-500' },
  error: { bg: 'bg-error-50', text: 'text-error-600', ring: 'bg-error-500' },
  accent: { bg: 'bg-accent-50', text: 'text-accent-600', ring: 'bg-accent-500' },
};

const activityIcons: Record<string, React.ReactNode> = {
  assignment: <UserCheck className="h-4 w-4" />,
  maintenance: <WrenchIcon className="h-4 w-4" />,
  procurement: <ShoppingCart className="h-4 w-4" />,
  license: <KeyIcon className="h-4 w-4" />,
  audit: <ClipboardCheck className="h-4 w-4" />,
  transfer: <ArrowRightLeft className="h-4 w-4" />,
};

export function Dashboard({ onNavigate }: DashboardProps) {
  const upcomingMaintenance = maintenanceRecords.filter((m) => m.status === 'Scheduled' || m.status === 'Overdue').slice(0, 4);

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => {
          const c = colorMap[kpi.color];
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', c.bg)}>
                  <Icon className={cn('h-5 w-5', c.text)} />
                </div>
                <span className={cn('inline-flex items-center gap-1 text-caption font-medium', kpi.trend === 'up' ? 'text-success-600' : kpi.trend === 'down' ? 'text-error-600' : 'text-surface-400')}>
                  {kpi.trend === 'up' ? <ArrowUpRight className="h-3.5 w-3.5" /> : kpi.trend === 'down' ? <ArrowDownRight className="h-3.5 w-3.5" /> : null}
                  {kpi.change}
                </span>
              </div>
              <p className="text-display font-bold text-surface-900 mt-4">{kpi.value}</p>
              <p className="text-body font-medium text-surface-700 mt-1">{kpi.label}</p>
              <p className="text-caption text-surface-500 mt-0.5">{kpi.sub}</p>
            </Card>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Asset Lifecycle */}
        <Card className="lg:col-span-2">
          <CardHeader title="Asset Lifecycle" description="Acquisitions vs. retirements over time" action={
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-caption"><span className="h-2.5 w-2.5 rounded-full bg-brand-500" />Acquired</span>
              <span className="flex items-center gap-1.5 text-caption"><span className="h-2.5 w-2.5 rounded-full bg-accent-400" />Retired</span>
            </div>
          } />
          <div className="p-5 h-64">
            <BarChart data={assetLifecycleData.map((d) => ({ label: d.month, value: d.acquired, value2: d.retired }))} height={220} />
          </div>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader title="Department Distribution" description="Assets by department" />
          <div className="p-5">
            <DonutChart
              data={departmentDistribution.map((d) => ({ label: d.department, value: d.count, color: d.color }))}
              centerValue="1,248"
              centerLabel="Total"
            />
          </div>
        </Card>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Asset Status */}
        <Card>
          <CardHeader title="Asset Status" description="Current portfolio breakdown" />
          <div className="p-5">
            <ProgressBarChart
              data={[
                { label: 'Available', value: kpis.available, max: kpis.totalAssets, color: 'bg-success-500' },
                { label: 'Assigned', value: kpis.assigned, max: kpis.totalAssets, color: 'bg-brand-500' },
                { label: 'In Maintenance', value: kpis.inMaintenance, max: kpis.totalAssets, color: 'bg-warning-500' },
                { label: 'Retired', value: kpis.totalAssets - kpis.available - kpis.assigned - kpis.inMaintenance, max: kpis.totalAssets, color: 'bg-surface-400' },
              ]}
            />
          </div>
        </Card>

        {/* Asset Type */}
        <Card>
          <CardHeader title="Asset Type" description="Distribution by category" />
          <div className="p-5">
            <ProgressBarChart
              data={assetTypeDistribution.map((t) => ({ label: t.type, value: t.count, max: 412, color: t.color }))}
            />
          </div>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader title="Pending Approvals" description="Requests awaiting review" action={<Badge variant="warning">{approvals.length} pending</Badge>} />
          <div className="p-3">
            {approvals.map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-2 py-2.5 rounded-md hover:bg-surface-50 transition-colors">
                <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0', a.priority === 'High' ? 'bg-error-50 text-error-600' : a.priority === 'Medium' ? 'bg-warning-50 text-warning-600' : 'bg-surface-100 text-surface-500')}>
                  <Clock className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-body font-medium text-surface-900 truncate">{a.title}</p>
                  <p className="text-caption text-surface-500">{a.type} · {a.date}</p>
                </div>
                <Button variant="ghost" size="sm">Review</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Third row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader title="Recent Activities" description="Latest events across the platform" action={<Button variant="ghost" size="sm">View all</Button>} />
          <div className="p-3">
            {activities.map((act) => (
              <div key={act.id} className="flex items-start gap-3 px-2 py-2.5 rounded-md hover:bg-surface-50 transition-colors">
                <div className="h-8 w-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  {activityIcons[act.type]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-body font-medium text-surface-900">{act.title}</p>
                  <p className="text-caption text-surface-500">{act.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-caption text-surface-400">{act.timestamp}</p>
                  <p className="text-caption text-surface-500 mt-0.5">{act.user}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Maintenance Calendar */}
        <Card>
          <CardHeader title="Maintenance Calendar" description="Upcoming maintenance" action={<Calendar className="h-4 w-4 text-surface-400" />} />
          <div className="p-3">
            {upcomingMaintenance.map((m) => (
              <div key={m.id} className="flex items-center gap-3 px-2 py-2.5 rounded-md hover:bg-surface-50 transition-colors">
                <div className="text-center shrink-0 w-10">
                  <p className="text-caption text-surface-400 uppercase">{new Date(m.scheduledDate).toLocaleDateString('en', { month: 'short' })}</p>
                  <p className="text-title font-bold text-surface-900">{new Date(m.scheduledDate).getDate()}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-body font-medium text-surface-900 truncate">{m.assetName}</p>
                  <p className="text-caption text-surface-500">{m.type} · {m.technician}</p>
                </div>
                <StatusBadge status={m.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
