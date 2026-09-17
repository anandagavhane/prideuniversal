import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  sectionName?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[ErrorBoundary] Caught error in ${this.props.sectionName || 'component'}:`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="mx-4 my-6 p-6 rounded-2xl bg-amber-50/90 border-2 border-amber-300 text-center shadow-md">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {this.props.sectionName ? `${this.props.sectionName} लोड करताना समस्या आली` : 'विभाग लोड करताना समस्या आली'}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            काही तांत्रिक अडचणीमुळे हा विभाग दाखवता आला नाही. कृपया पुन्हा प्रयत्न करा.
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm shadow hover:from-orange-600 hover:to-amber-600 active:scale-95 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            पुन्हा प्रयत्न करा (Retry)
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
