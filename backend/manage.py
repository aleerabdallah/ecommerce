#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from dotenv import load_dotenv


load_dotenv()


ENVIRONMENT = os.environ.get("ENVIRONMENT")


def main():
    """Run administrative tasks."""
    if ENVIRONMENT == "dev":
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings.dev")

    elif ENVIRONMENT == "prod":
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings.prod")

    else:
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings.staging")

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
