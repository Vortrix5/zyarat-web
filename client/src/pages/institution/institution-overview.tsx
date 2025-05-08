import { LineChart } from '@/components/charts/line-chart';
import { ErrorAlert } from '@/components/common/error-alert';
import { PageHeader } from '@/components/common/page-header';
import { SkeletonCard } from '@/components/common/skeleton-card';
import { StatCard } from '@/components/common/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { getInstitutionStats } from '@/services/api';
import { InstitutionStats } from '@/types';
import { DollarSignIcon, TicketIcon, UsersIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const InstitutionOverview: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<InstitutionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchStats();
    }
  }, [user?.id]);

  const fetchStats = async () => {
    try {
      const response = await getInstitutionStats(user!.id);
      setStats(response.data);
    } catch (err) {
      setError('Failed to load statistics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Prepare visitor trend chart data
  const visitorChartData = {
    labels: stats?.visitorTrend.map((item) => item.month) || [],
    datasets: [
      {
        label: 'Visitors',
        data: stats?.visitorTrend.map((item) => item.count) || [],
        tension: 0.4,
      },
    ],
  };

  // Prepare revenue trend chart data
  const revenueChartData = {
    labels: stats?.revenueTrend.map((item) => item.month) || [],
    datasets: [
      {
        label: 'Revenue (TND)',
        data: stats?.revenueTrend.map((item) => item.amount) || [],
        tension: 0.4,
      },
    ],
  };

  const renderStats = () => {
    if (loading) {
      return (
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

    if (error) {
      return <ErrorAlert description={error} />;
    }

    if (!stats) {
      return <div>No data available</div>;
    }

    return (
      <>
        <div className="grid gap-4 md:grid-cols-3 animate-in fade-in duration-500">
          <StatCard
            title="Total Visitors"
            value={stats.visitors.toLocaleString()}
            icon={<UsersIcon />}
            description="Total visitors to your institution"
            trend={{ value: 8.5, isPositive: true }}
          />
          <StatCard
            title="Total Revenue"
            value={`${stats.revenue.toLocaleString()} TND`}
            icon={<DollarSignIcon />}
            description="Total revenue generated"
            trend={{ value: 12.3, isPositive: true }}
          />
          <StatCard
            title="Tickets Sold"
            value={stats.ticketsSold.toLocaleString()}
            icon={<TicketIcon />}
            description="Total tickets sold"
            trend={{ value: 5.8, isPositive: true }}
          />
        </div>

        <div className="grid gap-4 mt-8 md:grid-cols-2 animate-in fade-in duration-500 delay-200">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={visitorChartData} height={300} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={revenueChartData} height={300} />
            </CardContent>
          </Card>
        </div>
      </>
    );
  };

  return (
    <div>
      <PageHeader
        title="Institution Overview"
        description="Monitor your institution's performance and statistics"
      />
      {renderStats()}
    </div>
  );
};