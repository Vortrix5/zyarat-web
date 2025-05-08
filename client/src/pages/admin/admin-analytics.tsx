import { BarChart } from '@/components/charts/bar-chart';
import { LineChart } from '@/components/charts/line-chart';
import { PieChart } from '@/components/charts/pie-chart';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { useState } from 'react';

export const AdminAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('revenue');

  // Mock data for charts
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue (TND)',
        data: [36000, 57000, 45000, 75000, 66000, 90000, 84000, 75000, 105000, 126000, 114000, 156000], // Illustrative TND values
        tension: 0.4,
      },
    ],
  };

  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'New Users',
        data: [120, 150, 180, 210, 250, 320, 380, 410, 460, 520, 580, 650],
        tension: 0.4,
      },
    ],
  };

  const ticketSalesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Ticket Sales',
        data: [500, 620, 550, 780, 720, 900, 850, 780, 950, 1100, 980, 1200],
        tension: 0.4,
      },
    ],
  };

  const userDemographicsData = {
    labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
    datasets: [
      {
        data: [25, 35, 20, 10, 7, 3],
      },
    ],
  };

  const revenueSourcesData = {
    labels: ['Tickets', 'Gift Shop', 'Donations', 'Memberships', 'Events'],
    datasets: [
      {
        data: [70, 10, 8, 7, 5], // Percentages, no currency
      },
    ],
  };

  return (
    <div>
      <PageHeader
        title="Insights & Analytics"
        description="Detailed analytics and platform metrics"
      />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart data={revenueData} height={300} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart data={revenueSourcesData} height={300} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue by Institution</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={{
                  labels: [
                    'Bardo National Museum',
                    'National Museum of Carthage',
                    'El Jem Amphitheatre',
                    'Sousse Archaeological Museum',
                    'Cité des Sciences',
                    'Dar Cherait Museum',
                  ],
                  datasets: [
                    {
                      label: 'Revenue (TND)',
                      data: [95000, 78000, 110000, 70000, 50000, 45000], // Illustrative TND values
                      borderWidth: 1,
                    },
                  ],
                }}
                height={300}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart data={userGrowthData} height={300} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart data={userDemographicsData} height={300} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Active Users by Region</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={{
                  labels: [
                    'North America',
                    'Europe',
                    'Asia',
                    'Australia',
                    'South America',
                    'Africa',
                  ],
                  datasets: [
                    {
                      label: 'Active Users',
                      data: [4500, 3200, 2800, 1500, 1200, 800],
                      borderWidth: 1,
                    },
                  ],
                }}
                height={300}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tickets Tab */}
        <TabsContent value="tickets" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart data={ticketSalesData} height={300} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ticket Types</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={{
                    labels: [
                      'Regular',
                      'Student',
                      'Senior',
                      'Group',
                      'Special Event',
                    ],
                    datasets: [
                      {
                        data: [45, 20, 15, 12, 8],
                      },
                    ],
                  }}
                  height={300}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tickets by Institution</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={{
                  labels: [
                    'Bardo National Museum',
                    'National Museum of Carthage',
                    'El Jem Amphitheatre',
                    'Sousse Archaeological Museum',
                    'Cité des Sciences',
                    'Dar Cherait Museum',
                  ],
                  datasets: [
                    {
                      label: 'Tickets Sold',
                      data: [1500, 1200, 1800, 2000, 1100, 950],
                      borderWidth: 1,
                    },
                  ],
                }}
                height={300}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};