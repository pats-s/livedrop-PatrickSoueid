export function connectToMetricsStream(
  timeRange: string,
  onUpdate: (data: any) => void,
  onError: (error: Error) => void
) {
  const API_URL = 'http://localhost:3000/api';
  const eventSource = new EventSource(`${API_URL}/admin/metrics/stream?range=${timeRange}`);

  eventSource.addEventListener('metrics', (event) => {
    const data = JSON.parse(event.data);
    onUpdate(data);
  });

  eventSource.onerror = () => {
    onError(new Error('SSE connection failed'));
    eventSource.close();
  };

  return () => {
    eventSource.close();
  };
}