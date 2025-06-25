'use client';
import { useEffect, useState } from 'react';
import { ProgressBar } from 'react-bootstrap';

export default function ProgressDemo({ isLoading }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0); // reset
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 5;
          return next >= 95 ? 95 : next; // jangan langsung 100 dulu
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setProgress(100); // sudah selesai
    }
  }, [isLoading]);

  return (
    <div className="p-4">
      <ProgressBar
        now={progress}
        label={`${progress}%`}
        animated
        striped
        style={{ width: '60%', margin: '0 auto' }}
      />
    </div>
  );
}
