import React from 'react';
import { useLocation } from 'react-router-dom';

type ErrorCatcherProps = {
  fallback: ({reset}) => React.ReactNode;
  children: React.ReactNode;
  location: any
};

type ErrorCatcherState = {
  hasError: boolean;
};

class ErrorCatcher extends React.Component<
  ErrorCatcherProps,
  ErrorCatcherState
> {
  constructor(props: ErrorCatcherProps) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(
    _error: Error
  ): Partial<ErrorCatcherState> | null {
    return { hasError: true };
  }

  resetState() {
    this.setState({ hasError: false });
  }

  componentDidUpdate(prevProps: Readonly<ErrorCatcherProps>, prevState: Readonly<ErrorCatcherState>, snapshot?: any): void {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({ hasError: false });
    }
  }
  componentDidCatch(_error: Error, _errorInfo: React.ErrorInfo): void {
    this.setState({
      hasError: true,
    });
  }

  render() {
    if (this.state.hasError) {
      
      return this.props.fallback({ reset: this.resetState.bind(this) });
    }
    return this.props.children;
  }
}

const withLocation = (Component) => (props) => <Component {...props} location={useLocation()}/>

export default withLocation(ErrorCatcher);