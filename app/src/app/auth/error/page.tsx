'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return {
          title: 'Configuration Error',
          message: 'There is a problem with the server configuration. Please contact support.',
        };
      case 'AccessDenied':
        return {
          title: 'Access Denied',
          message: 'You do not have permission to sign in.',
        };
      case 'Verification':
        return {
          title: 'Verification Error',
          message: 'The verification link may have expired or already been used.',
        };
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
      case 'OAuthAccountNotLinked':
        return {
          title: 'OAuth Error',
          message: 'There was a problem signing in with your provider. Please try again or use a different method.',
        };
      case 'CredentialsSignin':
        return {
          title: 'Sign In Failed',
          message: 'The email or password you entered is incorrect.',
        };
      default:
        return {
          title: 'Authentication Error',
          message: 'An unexpected error occurred. Please try again.',
        };
    }
  };

  const { title, message } = getErrorMessage(error);

  return (
    <div className="min-h-screen bg-[var(--background)] grid-pattern flex items-center justify-center p-4">
      <Card variant="default" padding="lg" className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {title}
          </h1>
          <p className="text-[var(--foreground-muted)]">
            {message}
          </p>
          {error && (
            <p className="text-xs text-[var(--foreground-muted)] mt-2">
              Error code: <code className="text-red-400">{error}</code>
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/auth/signin" className="flex-1">
            <Button variant="primary" className="w-full justify-center">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="secondary" className="w-full justify-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

