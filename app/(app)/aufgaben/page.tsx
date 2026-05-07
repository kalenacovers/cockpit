import { Archive, Check } from "lucide-react";
import { archiveTaskAction, markTaskDoneAction } from "@/lib/actions/tasks";
import { getAccountContext } from "@/lib/data/account";
import { getTasks } from "@/lib/data/tasks";
import { getUnits } from "@/lib/data/properties";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { TaskForm } from "@/components/forms/task-form";
import { formatDate } from "@/lib/utils";

export default async function TasksPage() {
  const { account } = await getAccountContext();
  const [tasks, units] = await Promise.all([
    getTasks(account.id),
    getUnits(account.id),
  ]);

  return (
    <div>
      <PageHeader
        title="Aufgaben"
        description="Alles, was du als Vermieter noch erledigen moechtest."
        action={
          <Button asChild>
            <a href="#aufgabe-erstellen">Aufgabe erstellen</a>
          </Button>
        }
      />

      <div className="space-y-6">
        <div id="aufgabe-erstellen">
          <TaskForm units={units} />
        </div>

        {tasks.length === 0 ? (
          <EmptyState
            title="Keine offenen Aufgaben"
            description="Alles sieht gut aus."
            actionLabel="Aufgabe erstellen"
            href="#aufgabe-erstellen"
          />
        ) : (
          <section className="grid gap-4 md:grid-cols-2">
            {tasks.map((task) => (
              <Card key={task.id} className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold leading-6 text-[#111111]">
                      {task.title}
                    </h2>
                    <p className="mt-1 text-sm text-[#525252]">
                      {task.unit?.name ?? "Allgemein"}
                    </p>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
                <p className="text-sm text-[#737373]">
                  Faellig: {formatDate(task.due_date)}
                </p>
                <div className="flex flex-wrap gap-2">
                  <form action={markTaskDoneAction}>
                    <input type="hidden" name="task_id" value={task.id} />
                    <Button variant="secondary" type="submit">
                      <Check className="h-4 w-4" aria-hidden="true" />
                      Erledigt markieren
                    </Button>
                  </form>
                  <form action={archiveTaskAction}>
                    <input type="hidden" name="task_id" value={task.id} />
                    <Button variant="ghost" type="submit">
                      <Archive className="h-4 w-4" aria-hidden="true" />
                      Archivieren
                    </Button>
                  </form>
                </div>
              </Card>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
