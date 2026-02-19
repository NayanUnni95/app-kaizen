type AnalyticsEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

export const analytics = {
  pageView: (url: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
      });
    }
  },

  event: ({ action, category, label, value }: AnalyticsEvent) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  },
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}