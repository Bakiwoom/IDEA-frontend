import { useEffect, useRef } from 'react';

// 컴포넌트 렌더링 성능 측정
export const withPerformanceTracking = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const renderCount = useRef(0);
    const startTime = useRef(performance.now());

    useEffect(() => {
      renderCount.current += 1;
      const endTime = performance.now();
      console.log(`${WrappedComponent.name || 'Component'} 렌더링 시간:`, endTime - startTime.current, 'ms');
      console.log(`${WrappedComponent.name || 'Component'} 렌더링 횟수:`, renderCount.current);
    });

    return <WrappedComponent {...props} />;
  };
};

// 컴포넌트 업데이트 추적
export const useComponentUpdateTracking = (componentName: string, props: any) => {
  const prevProps = useRef<any>(null);

  useEffect(() => {
    if (prevProps.current) {
      const changes: Record<string, { from: any; to: any }> = {};
      Object.keys({ ...prevProps.current, ...props }).forEach(key => {
        if (prevProps.current[key] !== props[key]) {
          changes[key] = {
            from: prevProps.current[key],
            to: props[key]
          };
        }
      });
      if (Object.keys(changes).length > 0) {
        console.log(`${componentName} 업데이트:`, changes);
      }
    }
    prevProps.current = props;
  });
};

// 메모리 사용량 모니터링
export const useMemoryMonitoring = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.performance) {
        const memory = (window.performance as any).memory;
        if (memory) {
          console.log('Memory Usage:', {
            totalJSHeapSize: formatBytes(memory.totalJSHeapSize),
            usedJSHeapSize: formatBytes(memory.usedJSHeapSize),
            jsHeapSizeLimit: formatBytes(memory.jsHeapSizeLimit)
          });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);
};

// API 응답 시간 측정
export const measureApiResponseTime = async (apiCall: () => Promise<any>) => {
  const startTime = performance.now();
  try {
    const result = await apiCall();
    const endTime = performance.now();
    console.log(`API Response Time: ${endTime - startTime}ms`);
    return result;
  } catch (error) {
    const endTime = performance.now();
    console.error(`API Error Response Time: ${endTime - startTime}ms`, error);
    throw error;
  }
};

// 바이트 단위 포맷팅
const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 렌더링 시간 측정
export const measureRenderTime = (componentName: string) => {
  const startTime = performance.now();
  return () => {
    const endTime = performance.now();
    console.log(`${componentName} Render Time: ${endTime - startTime}ms`);
  };
};