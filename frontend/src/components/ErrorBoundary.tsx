import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('cached_accounts');
      localStorage.removeItem('cached_nominations');
      localStorage.removeItem('cached_notifications');
      localStorage.removeItem('cached_sponsor_ads');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FEF7DA] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border-2 border-amber-400 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4 text-3xl">
              🌺
            </div>
            <h2 className="text-2xl font-black text-red-950 font-festive mb-2">
              ॥ गणपती बाप्पा मोरया ॥
            </h2>
            <p className="text-sm text-amber-900 font-semibold mb-4 font-marathi">
              काहीतरी अनपेक्षित त्रुटी आली आहे. कृपया पृष्ठ पुन्हा लोड करा.
            </p>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              We encountered an unexpected visual rendering state. Clicking below will safely clear the local snapshot cache and refresh the festival website.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-red-700 to-festival-saffron text-white shadow-lg hover:shadow-xl transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Festival Website</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

