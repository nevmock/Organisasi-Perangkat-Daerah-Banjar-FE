'use client';

import { Suspense, useState } from 'react';
import { ProgressDemo } from './ProgressDemo';

export default function SuspenseLoader({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Suspense fallback={<ProgressDemo isLoading={isLoading} />}>
      <ContentWithLoader onLoad={() => setIsLoading(false)}>
        {children}
      </ContentWithLoader>
    </Suspense>
  );
}

// Helper untuk trigger `onLoad` setelah Suspense selesai
function ContentWithLoader({ children, onLoad }) {
  React.useEffect(() => {
    onLoad();
  }, [onLoad]);
  return <>{children}</>;
}
