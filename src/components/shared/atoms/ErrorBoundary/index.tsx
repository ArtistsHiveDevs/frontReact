import { Component, ErrorInfo, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import './index.scss';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackMessageId: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Solo un componente de clase puede capturar errores de render con getDerivedStateFromError/componentDidCatch.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary] Render error caught in a page block:', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // FormattedMessage se suscribe directo al IntlContext, así el idioma queda correcto
      // aunque este boundary (ya "congelado" en hasError=true) no vuelva a re-renderizarse
      // por su cuenta cuando el locale cambie tras el catch inicial.
      return (
        <div className="error-boundary-fallback">
          <FormattedMessage id={this.props.fallbackMessageId} />
        </div>
      );
    }

    return this.props.children;
  }
}
