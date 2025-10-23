import { useState, useEffect } from 'react';
import { connectToMetricsStream } from '../lib/admin-sse-client';

interface Metrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
  totalChats: number;
  intentDistribution: Record<string, number>;
  avgResponseTime: number;
  citationAccuracy: number;
  apiLatency: number;
  activeSSEConnections: number;
}

export default function AdminPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    setIsLive(true);
    
    const cleanup = connectToMetricsStream(
      timeRange,
      (data) => {
        setMetrics(data);
        setIsLoading(false);
      },
      (error) => {
        console.error('Metrics stream error:', error);
        setIsLive(false);
      }
    );

    return cleanup;
  }, [timeRange]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading metrics...</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Failed to load metrics</p>
      </div>
    );
  }

  const intentEntries = Object.entries(metrics.intentDistribution || {});
  const totalIntents = intentEntries.reduce((sum, [, count]) => sum + (count || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor your business and assistant performance</p>
        </div>

        {isLive && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded p-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-700">Live metrics - auto-updating</span>
          </div>
        )}

        <div className="mb-6 flex gap-2">
          {['24h', '7d', '30d', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {range === '24h' ? 'Last 24h' : range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'All time'}
            </button>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Business Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Revenue"
              value={`$${metrics.totalRevenue.toFixed(2)}`}
              icon="💰"
            />
            <MetricCard
              title="Total Orders"
              value={metrics.totalOrders.toString()}
              icon="📦"
            />
            <MetricCard
              title="Total Customers"
              value={metrics.totalCustomers.toString()}
              icon="👥"
            />
            <MetricCard
              title="Avg Order Value"
              value={`$${metrics.avgOrderValue.toFixed(2)}`}
              icon="💵"
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Assistant Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Intent Distribution</h3>
              {intentEntries.length === 0 ? (
                <p className="text-gray-500 text-sm">No conversations yet</p>
              ) : (
                <div className="space-y-3">
                  {intentEntries.map(([intent, count]) => {
                    const percentage = totalIntents > 0 ? (count / totalIntents) * 100 : 0;
                    return (
                      <div key={intent}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700 capitalize">
                            {intent.replace('_', ' ')}
                          </span>
                          <span className="text-gray-600">
                            {count} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Performance Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total Conversations</p>
                  <p className="text-2xl font-bold">{metrics.totalChats}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                  <p className="text-2xl font-bold">{metrics.avgResponseTime}ms</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Citation Accuracy</p>
                  <p className="text-2xl font-bold">{metrics.citationAccuracy.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">System Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="API Latency"
              value={`${metrics.apiLatency}ms`}
              icon="⚡"
            />
            <MetricCard
              title="Active SSE Connections"
              value={metrics.activeSSEConnections.toString()}
              icon="🔗"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}