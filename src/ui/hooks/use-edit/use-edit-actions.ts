import { get, Readable, Writable } from "svelte/store";

import { OnUpdateFn, Tasks } from "../../../types";
import { areValuesEmpty } from "../../../util/task-utils";
import { getDiff, updateText } from "../../../util/tasks-utils";

import { EditOperation } from "./types";

interface UseEditActionsProps {
  baselineTasks: Writable<Tasks>;
  editOperation: Writable<EditOperation>;
  displayedTasks: Readable<Tasks>;
  onUpdate: OnUpdateFn;
}

export function useEditActions({
  editOperation,
  baselineTasks,
  displayedTasks,
  onUpdate,
}: UseEditActionsProps) {
  function startEdit(operation: EditOperation) {
    editOperation.set(operation);
  }

  function cancelEdit() {
    editOperation.set(undefined);
  }

  async function confirmEdit() {
    if (get(editOperation) === undefined) {
      return;
    }

    const currentTasks = get(displayedTasks);

    // TODO: order matters! Make it more explicit
    editOperation.set(undefined);

    const diff = getDiff(get(baselineTasks), currentTasks);

    if (areValuesEmpty(diff)) {
      return;
    }

    baselineTasks.set(currentTasks);

    await onUpdate(updateText(diff));
  }

  return {
    startEdit,
    confirmEdit,
    cancelEdit,
  };
}
