const EVENT_TYPE = ['link', 'navigate', 'recommend'] as const;
type EventType = (typeof EVENT_TYPE)[number];

type TrackEvent = (
  event_name: string,
  event_data?: { type?: EventType } & { [key: string]: string | number },
) => void;

declare const umami:
  | { track: (...args: Parameters<TrackEvent>) => void }
  | undefined;

export const trackEvent: TrackEvent = (...args) => {
  if (typeof umami !== 'undefined' && typeof umami.track === 'function') {
    umami.track(...args);
  }
};
