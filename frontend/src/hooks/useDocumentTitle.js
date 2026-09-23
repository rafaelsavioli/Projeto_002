import { useEffect, useState } from 'react';

export default function useDocumentTitle(title) {
  const [current, setCurrent] = useState(title);

  useEffect(() => {
    const base = 'FluxoBoard';
    const next = title ? `${title} · ${base}` : base;
    document.title = next;
    setCurrent(next);
    return () => {
      document.title = base;
    };
  }, [title]);

  return current;
}
