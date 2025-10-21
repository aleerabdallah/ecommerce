# myapp/management/commands/schedule_qstash_tasks.py

from django.core.management.base import BaseCommand
from django_qstash.schedules.models import TaskSchedule
from django_qstash.discovery.utils import discover_tasks


class Command(BaseCommand):
    help = "Schedule QStash periodic tasks"

    def handle(self, *args, **options):
        available_tasks = discover_tasks(locations_only=True)

        # Define your periodic tasks here
        tasks_to_schedule = [
            {
                "name": "Send Daily Email",
                "cron": "*/2 * * * *",  # every day at 7 AM
                "task_name": "newsletter.tasks.send_scheduled_newsletters",
                "args": [],
                "kwargs": {}
            },
            {
                "name": "Mark pass events",
                "cron": "*/2 * * * *",  # every day at 3 AM
                "task_name": "events.tasks.mark_pass_events",
                "args": [],
                "kwargs": {}
            },
            # {
            #     "name": "Sync Remote Data",
            #     "cron": "*/30 * * * *",  # every 30 minutes
            #     "task_name": "myapp.tasks.sync_remote_data",
            #     "args": [],
            #     "kwargs": {"source": "api_service"}
            # },
        ]

        for task in tasks_to_schedule:
            name = task["name"]
            task_name = task["task_name"]

            if task_name not in available_tasks:
                self.stdout.write(self.style.WARNING(f"Skipping '{name}': Task not found ({task_name})"))
                continue

            # print(task_name)
            created = TaskSchedule.objects.create(
                name=name,
                cron=task["cron"],
                task=task_name,
                args=task["args"],
                kwargs=task["kwargs"],
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f"Created schedule: {name}"))
            else:
                self.stdout.write(self.style.NOTICE(f"Updated schedule: {name}"))

        self.stdout.write(self.style.SUCCESS("✅ All tasks scheduled."))
