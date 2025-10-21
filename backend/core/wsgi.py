"""
WSGI config for core project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os
from dotenv import load_dotenv
from django.core.wsgi import get_wsgi_application


load_dotenv()



# Choose the settings module based on an env variable
ENVIRONMENT = os.environ.get("ENVIRONMENT")

if ENVIRONMENT == "dev":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings.dev")

elif ENVIRONMENT == "prod":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings.prod")

else:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings.staging")

application = get_wsgi_application()
