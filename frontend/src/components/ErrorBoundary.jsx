import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 p-6">
          <div className="card bg-base-200 shadow-xl max-w-lg w-full">
            <div className="card-body items-center text-center space-y-4">
              <div className="text-6xl">⚠️</div>
              <h2 className="card-title text-2xl">Something Went Wrong</h2>
              <p className="text-base-content/70 text-sm">
                An unexpected error occurred. Please try refreshing the page or
                clicking the button below.
              </p>
              {this.state.error && (
                <div className="bg-error/10 text-error rounded-lg p-3 text-xs w-full text-left font-mono overflow-auto max-h-32">
                  {this.state.error.message}
                </div>
              )}
              <div className="card-actions mt-4 gap-3">
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </button>
                <button
                  className="btn btn-outline"
                  onClick={this.handleReset}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
