from .base import *



# INSTALLED_APPS += [
#     'debug_toolbar',
# ]



DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}



STATIC_URL = '/static/'



# MailTrap CONFIGURATION

MAILTRAP_APITOKEN = os.environ.get("MAILTRAP_APITOKEN")
SENDER_DEMOMAIL = os.environ.get("SENDER_DEMOMAIL")
DEFAULT_FROM_MAIL = os.environ.get("DEFAULT_FROM_MAIL")


# EMAIL CONFIGURATION
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
# EMAIL_PORT = os.environ.get("EMAIL_PORT")
# EMAIL_HOST = os.environ.get("EMAIL_HOST")
# EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER")
# EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD")
# EMAIL_USE_TLS = True
# EMAIL_USER_SSL = False

EMAIL_PORT = os.environ.get("EMAIL_PORT")
EMAIL_HOST = os.environ.get("EMAIL_HOST")
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD")
EMAIL_USE_TLS = True
EMAIL_USER_SSL = False



###########################
# qstash-py settings
###########################
QSTASH_TOKEN = os.environ.get("QSTASH_TOKEN")
QSTASH_CURRENT_SIGNING_KEY = os.environ.get("QSTASH_CURRENT_SIGNING_KEY")
QSTASH_NEXT_SIGNING_KEY = os.environ.get("QSTASH_NEXT_SIGNING_KEY")
###########################
# django_qstash settings
###########################
DJANGO_QSTASH_DOMAIN = os.environ.get("DJANGO_QSTASH_DOMAIN")
DJANGO_QSTASH_WEBHOOK_PATH = os.environ.get("DJANGO_QSTASH_WEBHOOK_PATH")
DJANGO_QSTASH_FORCE_HTTPS = True
DJANGO_QSTASH_RESULT_TTL = 604800



# CELERY CONFIGURATION

# CELERY_BROKER_URL = 'redis://localhost:6379/0'
# CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'