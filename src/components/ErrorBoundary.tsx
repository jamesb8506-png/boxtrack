import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[BoxTrack] Erreur non gérée :', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-950 flex items-center justify-center mb-4">
            <AlertTriangle size={28} className="text-red-500" />
          </div>
          <h1 className="text-lg font-bold mb-2">Une erreur est survenue</h1>
          <p className="text-sm text-zinc-500 mb-6 max-w-xs">
            L'application a rencontré un problème inattendu. Vos données locales ne sont pas affectées.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm"
          >
            Recharger l'application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
