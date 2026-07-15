import { reactive, ref } from 'vue';

import { landingService } from '@/features/landing/services';
import { AppError } from '@/core/types/app-error';

interface NewsletterFormState {
  email: string;
}

/**
 * UI-local state for the "create account" CTA email capture. Deliberately
 * kept out of Pinia — nothing outside this form cares about its state.
 */
export function useNewsletterForm() {
  const form = reactive<NewsletterFormState>({ email: '' });
  const isSubmitting = ref(false);
  const isSuccess = ref(false);
  const fieldErrors = ref<Record<string, string[]>>({});
  const generalError = ref<string | null>(null);

  function resetFeedback(): void {
    isSuccess.value = false;
    fieldErrors.value = {};
    generalError.value = null;
  }

  async function submit(): Promise<void> {
    resetFeedback();
    isSubmitting.value = true;

    try {
      await landingService.subscribeToNewsletter(form.email);
      isSuccess.value = true;
      form.email = '';
    } catch (error) {
      if (error instanceof AppError) {
        if (error.kind === 'validation' && error.fieldErrors) {
          fieldErrors.value = error.fieldErrors;
        } else {
          generalError.value = error.message;
        }
      } else {
        generalError.value = 'Something went wrong. Please try again.';
      }
    } finally {
      isSubmitting.value = false;
    }
  }

  return { form, isSubmitting, isSuccess, fieldErrors, generalError, submit };
}
