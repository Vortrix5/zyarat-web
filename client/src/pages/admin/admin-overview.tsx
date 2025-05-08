import { BarChart } from '@/components/charts/bar-chart';
import { ErrorAlert } from '@/components/common/error-alert';
import { PageHeader } from '@/components/common/page-header';
import { SkeletonCard } from '@/components/common/skeleton-card';
import { StatCard } from '@/components/common/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAdminStats } from '@/services/api';
import { AdminStats } from '@/types';
import { BuildingIcon, DollarSignIcon, TicketIcon, UserIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAdminStats();
        setStats(response.data);
      } catch (err) {
        setError('Failed to load overview data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Prepare user growth chart data
  const userGrowthChartData = {
    labels: stats?.userGrowthData.map((item) => item.month) || [],
    datasets: [
      {
        label: 'New Users',
        data: stats?.userGrowthData.map((item) => item.count) || [],
        borderWidth: 1,
      },
    ],
  };

  const renderStats = () => {
    if (loading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in duration-500">
          <StatCard
            title="Total Revenue"
            value={`${stats.totalRevenue.toLocaleString()} TND`}
            icon={<DollarSignIcon />}
            description="Total revenue generated"
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatCard
            title="Tickets Sold"
            value={stats.ticketsSold.toLocaleString()}
            icon={<TicketIcon />}
            description="Total tickets sold"
            trend={{ value: 8.2, isPositive: true }}
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={<UserIcon />}
            description="Registered platform users"
            trend={{ value: 5.7, isPositive: true }}
          />
          <StatCard
            title="Pending Institutions"
            value={stats.pendingInstitutions.toString()}
            icon={<BuildingIcon />}
            description="Institutions awaiting approval"
            trend={{ value: 2.1, isPositive: false }}
          />
        </div>

        <div className="grid gap-4 mt-8 md:grid-cols-2 animate-in fade-in duration-500 delay-200">
          <Card>
            <CardHeader>
              <CardTitle>Monthly User Onboarding</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={userGrowthChartData} height={300} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Cultural Institutions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topInstitutions.map((institution) => (
                  <div
                    key={institution.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{institution.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {institution.visitors.toLocaleString()} visitors
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {institution.revenue.toLocaleString()} TND
                      </p>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  };

  return (
    <div>
      <PageHeader
        title="Platform Overview"
        description="Monitor key metrics and performance indicators"
      />
      {renderStats()}
    </div>
  );
};