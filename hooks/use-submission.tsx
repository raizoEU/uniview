import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type SubmissionOptions<T> = {
  action: (data: T) => Promise<any>;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
};

/**
 * Custom hook for handling async operations with loading state, error handling, and notifications.
 * @param {SubmissionOptions<T>} options - Configuration options for the async handler.
 * @returns { execute, isLoading } - The function to trigger the action and a loading state.
 */
export function useSubmission<T>({
  action,
  loadingMessage,
  successMessage,
  errorMessage,
  onSuccess,
}: SubmissionOptions<T>) {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Executes the provided async function while managing loading state, errors, and notifications.
   * @param {T} data - The data to pass into the async function.
   */
  const execute = async (data: T) => {
    toast.loading(loadingMessage ?? "Processing...");
    setIsLoading(true);

    try {
      await action(data);
      toast.success(successMessage ?? "Operation successful!");

      onSuccess?.();
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast.error(errorMessage ?? "Something went wrong. Please try again.");
    } finally {
      toast.dismiss();
      setIsLoading(false);
    }
  };

  return { execute, isLoading };
}
