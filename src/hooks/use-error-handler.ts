
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface ErrorHandlerOptions {
  showToast?: boolean;
  defaultErrorMessage?: string;
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const { showToast = true, defaultErrorMessage = "Ocorreu um erro inesperado" } = options;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Wraps an async function with error handling logic
   * @param fn Async function to execute
   * @param errorMessage Custom error message to display
   * @returns Result of the async function if successful
   */
  const withErrorHandling = async <T,>(
    fn: () => Promise<T>,
    errorMessage?: string
  ): Promise<T | undefined> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fn();
      setLoading(false);
      return result;
    } catch (err) {
      console.error('Error in withErrorHandling:', err);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setLoading(false);
      
      if (showToast) {
        toast({
          title: "Erro",
          description: errorMessage || defaultErrorMessage,
          variant: "destructive",
        });
      }
      
      return undefined;
    }
  };

  return { withErrorHandling, loading, error, setError };
}
