import { isProdEnvironment } from '~/common/utils/app-utils/app-utils';

// src/analytics.ts
export const initGA = (measurementId: string): void => {
  if (isProdEnvironment()) {
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]): void {
      (window as any).dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', measurementId, {
      send_page_view: false,
    });
  }
};

export const logPageView = (params?: { title?: string; url?: string }): void => {
  if (isProdEnvironment()) {
    let { url, title } = params || {};

    if (!url && window.location) {
      url = window.location.pathname + window.location.search;
    }
    if (!title) {
      title = document.title;
    }
    if (url) {
      (window as any).gtag('config', 'G-BVRLBFQS28', {
        page_path: url,
        page_title: title,
        send_page_view: false,
      });
    }
  }
};

export const logEvent = (action: string, category: string, label?: string, value?: number): void => {
  if (isProdEnvironment()) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const logPageViewEvent = (params?: {
  page_title?: string;
  page_location?: string;
  page_path?: string;
}): void => {
  if (isProdEnvironment()) {
    const algo: string = import.meta.env.GA_PREVENT_ANALYTICS;
    console.log('$$$$$$$    ', algo);

    let { page_title, page_location, page_path } = params || {};
    if (!page_title) {
      page_title = document.title;
    }

    if (!page_location) {
      page_location = window.location.href;
    }

    if (!page_path) {
      page_path = window.location.pathname + window.location.search;
    }
    console.log('GA EVENT PAGE VIEW MANUAL', page_title, page_location, page_path);

    (window as any).gtag('event', 'page_view', {
      page_title,
      page_location,
      page_path,
      // send_to,
    });
  }
};

export const logUser = (userId: string): void => {
  if (isProdEnvironment()) {
    (window as any).gtag('set', { user_id: userId });
  }
};
