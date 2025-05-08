import { useTheme } from '@/context/theme-provider';
import { cn } from '@/lib/utils';
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface PieChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor?: string[];
      borderColor?: string[];
      borderWidth?: number;
    }[];
  };
  title?: string;
  height?: number;
  className?: string;
}

export const PieChart: React.FC<PieChartProps> = ({
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
    const gridBorderColor = rootStyle.getPropertyValue('--border').trim();

    const themeDatasetColors = [
      `hsl(${rootStyle.getPropertyValue('--chart-1').trim()})`,
      `hsl(${rootStyle.getPropertyValue('--chart-2').trim()})`,
      `hsl(${rootStyle.getPropertyValue('--chart-3').trim()})`,
      `hsl(${rootStyle.getPropertyValue('--chart-4').trim()})`,
      `hsl(${rootStyle.getPropertyValue('--chart-5').trim()})`,
    ];

    const newDatasets = data.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: (dataset.backgroundColor && dataset.backgroundColor.length > 0)
        ? dataset.backgroundColor
        : dataset.data.map((_, i) => themeDatasetColors[i % themeDatasetColors.length]),
      borderColor: (dataset.borderColor && dataset.borderColor.length > 0)
        ? dataset.borderColor
        : dataset.data.map(() => `hsl(${rootStyle.getPropertyValue('--card').trim()})`),
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
    });
  }, [data, title, resolvedTheme]);

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
};