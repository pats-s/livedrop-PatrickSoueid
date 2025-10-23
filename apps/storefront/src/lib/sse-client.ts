export function connectToOrderStream(
  orderId: string,
  onUpdate: (data: any) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) {
  const API_URL = 'http://localhost:3000/api';
  const eventSource = new EventSource(`${API_URL}/orders/${orderId}/stream`);

  eventSource.addEventListener('status', (event) => {
    const data = JSON.parse(event.data);
    onUpdate(data);
  });

  eventSource.addEventListener('complete', (event) => {
    onComplete();
    eventSource.close();
  });

  eventSource.addEventListener('error', (event) => {
    onError(new Error('Connection error'));
  });

  eventSource.onerror = () => {
    onError(new Error('SSE connection failed'));
    eventSource.close();
  };

  // Return cleanup function
  return () => {
    eventSource.close();
  };
}