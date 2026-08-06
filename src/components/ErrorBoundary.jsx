import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Catches render-time errors in its subtree and shows a fallback UI instead
 * of letting React unmount the whole tree (which otherwise renders as a
 * blank white page — there is no default fallback in React).
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function'
          ? this.props.fallback(this.handleRetry)
          : this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
          <div className="max-w-sm w-full text-center bg-white border border-stone-100 rounded-3xl shadow-sm p-8">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle size={22} />
            </div>
            <h2 className="font-semibold text-stone-800 mb-1">Something went wrong</h2>
            <p className="text-sm text-stone-500 mb-5">
              Please try reloading the page. If the problem continues, contact Dheyn at Dheyn.main@gmail.com.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
