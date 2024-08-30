import mixpanel from "mixpanel-browser"

export const trackEvent = <T extends object>(eventName: string, properties: T) => {
  try {
    mixpanel.track(eventName, properties)
  } catch (error) {
    console.error("Error tracking event", error, eventName)
  }
}
