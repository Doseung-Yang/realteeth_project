"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./Button";
import { Card } from "./Card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="min-h-[200px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 font-medium mb-2">
              오류가 발생했습니다
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {this.state.error?.message || "알 수 없는 오류가 발생했습니다"}
            </p>
            <Button variant="primary" onClick={this.handleReset}>
              다시 시도
            </Button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}
