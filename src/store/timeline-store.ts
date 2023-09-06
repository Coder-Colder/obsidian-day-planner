import { derived, get } from "svelte/store";

import { SNAP_STEP_MINUTES } from "../constants";

import { settings } from "./settings";

export const hourSize = derived(
  settings,
  ($settings) => $settings.zoomLevel * 60,
);

const hoursInDay = [...Array(24).keys()];

export const visibleHours = derived(settings, ($settings) =>
  hoursInDay.slice($settings.startHour),
);

// todo: this is out of place
export const hiddenHoursSize = derived(
  [settings, hourSize],
  ([$settings, $hourSize]) => $settings.startHour * $hourSize,
);

// todo: this is out of place
export const timeToTimelineOffset = derived(
  [settings, hiddenHoursSize],
  ([$settings, $hiddenHoursSize]) =>
    (minutes: number) =>
      minutes * $settings.zoomLevel - $hiddenHoursSize,
);

// todo: this is out of place
export function roundToSnapStep(coords: number) {
  const { zoomLevel } = get(settings);
  return coords - (coords % (SNAP_STEP_MINUTES * zoomLevel));
}

// todo: this is out of place
export function getTimeFromYOffset(yCoords: number) {
  const { zoomLevel } = get(settings);
  return (yCoords + get(hiddenHoursSize)) / zoomLevel;
}

// todo: this is out of place
export function sizeToDuration(size: number) {
  const { zoomLevel } = get(settings);
  return size / zoomLevel;
}

// todo: this is out of place
export const durationToSize = derived(settings, ($settings) => {
  return (duration: number) => {
    const { zoomLevel } = $settings;
    return duration * zoomLevel;
  };
});
