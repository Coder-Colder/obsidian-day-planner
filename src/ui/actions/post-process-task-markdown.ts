import { DayPlannerSettings } from "../../settings";
import { UnscheduledTask } from "../../types";
import { createTimestamp } from "../../util/task-utils";

export function decorate(
  el: HTMLElement,
  task: UnscheduledTask,
  settings: DayPlannerSettings,
) {
  const checkBox = el.querySelector('input[type="checkbox"]');

  // TODO: fix this forking
  // TODO: should work with list items
  // @ts-expect-error
  if (checkBox && settings.showTimestampInTaskBlock && task.startMinutes) {
    const timestamp = createTimestamp(
      // @ts-expect-error
      task.startMinutes,
      task.durationMinutes,
      settings.timestampFormat,
    );

    checkBox.after(
      createSpan({
        text: timestamp,
        cls: "day-planner-task-decoration",
      }),
    );
  }
  // @ts-expect-error
  else if (settings.showTimestampInTaskBlock && task.startMinutes) {
    const timestamp = createTimestamp(
      // @ts-expect-error
      task.startMinutes,
      task.durationMinutes,
      settings.timestampFormat,
    );
    const para = el.querySelector("p");
    para.before(
      createSpan({
        text: timestamp,
        cls: "day-planner-task-decoration",
      }),
    );
  }
}

export function disableCheckBoxes(el: HTMLElement) {
  el
    .querySelectorAll(`input[type="checkbox"]`)
    ?.forEach((checkbox) => checkbox.setAttribute("disabled", "true"));
}
