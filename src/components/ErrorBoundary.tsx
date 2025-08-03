import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onError: (error: string) => void;
}

interface State {
  hasError: boolean;
  error: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError(error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-screen">
          <h2>Что-то пошло не так</h2>
          <p>{this.state.error}</p>
          <button onClick={() => window.location.reload()}>
            Перезагрузить приложение
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 