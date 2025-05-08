import { useTheme } from '@/context/theme-provider'; // Import useTheme
import { cn } from '@/lib/utils';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string; // Made optional
      backgroundColor?: string; // Made optional, often used for area under line
      tension?: number;
    }[];
  };
  title?: string;
  height?: number;
  className?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
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
      borderColor: dataset.borderColor || themeDatasetColors[index % themeDatasetColors.length],
      backgroundColor: dataset.backgroundColor || themeDatasetColors[index % themeDatasetColors.length], // Or a semi-transparent version
      tension: dataset.tension || 0.1,
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
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};