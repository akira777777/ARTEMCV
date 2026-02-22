export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export const sendContactForm = async (data: ContactFormData): Promise<{ success: boolean }> => {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Form data sent:', data);
      resolve({ success: true });
    }, 1000);
  });
};
