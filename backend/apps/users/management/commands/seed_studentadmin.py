from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group
from django.contrib.sites.models import Site


class Command(BaseCommand):
    help = "Creates a user and admin group if they doesn't exist"

    def handle(self, *args, **options):
        try:
            site = Site.objects.filter(name="alsulk").exists()
            if not site:

                Site.objects.create(domain="https://ecom.com", name="ecom")
                self.stdout.write(self.style.SUCCESS("Created site object"))
            else:
                self.stdout.write(self.style.HTTP_INFO("Site object Already exists"))

            groups = ["user", "admin"]
            for group in groups:
                exists = Group.objects.filter(name=group).exists()
                if not exists:
                    Group.objects.create(name=group)

            self.stdout.write(self.style.SUCCESS("Created a group successfully. 🚀"))

        except Exception as e:

            self.stdout.write(e)
