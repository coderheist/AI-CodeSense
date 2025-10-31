import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 text-gray-200 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-gray-900 rounded-xl border border-gray-800 p-8">
            <h1 className="text-3xl font-bold text-red-500 mb-4">⚠️ Oops! Something went wrong</h1>
            <p className="text-gray-400 mb-6">
              The application encountered an error. Please try refreshing the page.
            </p>
            
            {this.state.error && (
              <div className="bg-gray-800 p-4 rounded-lg mb-4">
                <p className="text-sm font-mono text-red-400">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-gray-950 font-semibold rounded-lg hover:bg-primary/90 transition-all"
            >
              Refresh Page
            </button>
            
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-4">
                <summary className="cursor-pointer text-gray-400 hover:text-gray-300">
                  Error Details (Dev Mode)
                </summary>
                <pre className="mt-2 text-xs bg-gray-800 p-4 rounded overflow-auto max-h-96">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
