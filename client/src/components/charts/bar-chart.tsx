import { useTheme } from '@/context/theme-provider'; // Import useTheme
import { cn } from '@/lib/utils';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string; // Made optional
      borderColor?: string;
      borderWidth?: number;
    }[];
  };
  title?: string;
  height?: number;
  className?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  height = 300,
  className,
}) => {
  const { resolvedTheme } = useTheme();
  const [chartData, setChartData] = useState(data);
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const foregroundColor = rootStyle.getPropertyValue('--foreground').trim();
    const mutedForegroundColor = rootStyle.getPropertyValue('--muted-foreground').trim();
    const gridBorderColor = rootStyle.getPropertyValue('--border').trim();

    const themeDatasetColors = [
      `hsl(${rootStyle.getPropertyValue('--chart-1').trim()})`,
      `hsl(${rootStyle.getPropertyValue('--chart-2').trim()})`,
      `hsl(${rootStyle.getPropertyValue('--chart-3').trim()})`,
      `hsl(${rootStyle.getPropertyValue('--chart-4').trim()})`,
      `hsl(${rootStyle.getPropertyValue('--chart-5').trim()})`,
    ];

    const newDatasets = data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || themeDatasetColors[index % themeDatasetColors.length],
      borderColor: dataset.borderColor || themeDatasetColors[index % themeDatasetColors.length],
      borderWidth: dataset.borderWidth || 1,
    }));
    setChartData({ ...data, datasets: newDatasets });

    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: `hsl(${foregroundColor})`,
          },
        },
        title: {
          display: !!title,
          text: title,
          color: `hsl(${foregroundColor})`,
        },
        tooltip: {
          bodyColor: `hsl(${foregroundColor})`,
          titleColor: `hsl(${foregroundColor})`,
          backgroundColor: `hsl(${rootStyle.getPropertyValue('--card').trim()})`,
          borderColor: `hsl(${gridBorderColor})`,
          borderWidth: 1,
        }
      },
      scales: {
        x: {
          ticks: {
            color: `hsl(${mutedForegroundColor})`,
          },
          grid: {
            color: `hsl(${gridBorderColor})`,
          },
        },
        y: {
          ticks: {
            color: `hsl(${mutedForegroundColor})`,
          },
          grid: {
            color: `hsl(${gridBorderColor})`,
          },
        },
      },
    });
  }, [data, title, resolvedTheme]);

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};