import type { Moment } from "moment";
import { derived, Readable, writable } from "svelte/store";

import type { PlanItem } from "../../types";
import { getRelationToNow } from "../../util/moment";

import type { ReactiveSettingsWithUtils } from "./new-use-drag";
import { useDrag } from "./new-use-drag";

interface CreateTaskProps {
  settings: ReactiveSettingsWithUtils;
  currentTime: Readable<Moment>;
  cursorOffsetY: Readable<number>;
  onUpdate: (updated: PlanItem) => Promise<void>;
}

export function useTask(
  task: PlanItem,
  { settings, currentTime, cursorOffsetY, onUpdate }: CreateTaskProps,
) {
  const { dragging, ...useDragValues } = useDrag({
    settings,
    cursorOffsetY,
    task,
    onUpdate,
  });

  // todo: use real one
  const resizing = writable(false);

  const initialOffset = derived(
    // todo: not sure if this is the cleanest way
    [settings.settings, settings.hiddenHoursSize],
    ([$settings, $hiddenHoursSize]) => {
      return task.startMinutes * $settings.zoomLevel - $hiddenHoursSize;
    },
  );

  const offset = derived(
    [dragging, initialOffset, cursorOffsetY],
    ([$dragging, $initialOffset, $cursorOffsetY]) => {
      return $dragging ? $cursorOffsetY : $initialOffset;
    },
  );

  const initialHeight = derived([settings.settings], ([$settings]) => {
    return task.durationMinutes * $settings.zoomLevel;
  });

  const height = derived(
    [resizing, initialHeight],
    ([$resizing, $initialHeight]) => {
      // todo: add real impl
      return $resizing ? 200 : $initialHeight;
    },
  );

  const relationToNow = derived([currentTime], ([$currentTime]) => {
    return getRelationToNow($currentTime, task.startTime, task.endTime);
  });

  return {
    offset,
    height,
    relationToNow,
    ...useDragValues,
  };
}
