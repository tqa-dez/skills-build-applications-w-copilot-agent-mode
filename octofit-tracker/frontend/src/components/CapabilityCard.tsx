import { useEffect, useState, type ReactNode } from 'react';
import { getJson } from '../api/client.js';

type Props = {
  title: string;
  description: string;
  load: () => Promise<unknown>;
  emptyMessage: string;
  renderContent: (data: unknown) => ReactNode;
  isEmpty: (data: unknown) => boolean;
};

export function CapabilityCard({ title, description, load, emptyMessage, renderContent, isEmpty }: Props) {
  const [state, setState] = useState<{ status: 'loading' | 'success' | 'error'; data?: unknown; message?: string }>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });
    load()
      .then((data) => { if (active) setState({ status: 'success', data }); })
      .catch((error: Error) => { if (active) setState({ status: 'error', message: error.message }); });
    return () => { active = false; };
  }, [load]);

  return <section className="card h-100"><div className="card-body"><h2 className="h4">{title}</h2><p>{description}</p>{state.status === 'loading' && <p role="status">Loading {title.toLowerCase()}...</p>}{state.status === 'error' && <p role="alert">Unable to load {title.toLowerCase()}: {state.message}</p>}{state.status === 'success' && state.data !== undefined && (isEmpty(state.data) ? <p role="status">{emptyMessage}</p> : renderContent(state.data))}</div></section>;
}
