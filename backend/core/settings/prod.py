from .base import *
from django.conf.global_settings import DATABASES
import dj_database_url




# DATABASE CONFIG

DATABASES['default'] = dj_database_url.parse(
    os.getenv('ALSULK_DB_URL'),
    conn_max_age=600,
    conn_health_checks=True

)



# CORS_ALLOW_CREDENTIALS = True  # Required to send cookies
CORS_EXPOSE_HEADERS = ['Authorization']
# PRODUCTION CHECKLIST

SESSION_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = True
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True



# CLOUDINARY CONFIG

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.getenv('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': os.getenv('CLOUDINARY_API_KEY'),
    'API_SECRET': os.getenv('CLOUDINARY_API_SECRET'),
    'SECURE': True,
    'MEDIA_TAG': 'media',
    'INVALID_VIDEO_ERROR_MESSAGE': 'Please upload a valid video file.',
    'EXCLUDE_DELETE_ORPHANED_MEDIA_PATHS': (),
    'STATIC_TAG': 'static',
    'STATICFILES_MANIFEST_ROOT': os.path.join(BASE_DIR, 'manifest'),
    'STATIC_IMAGES_EXTENSIONS': [
        'jpg', 'jpe', 'jpeg', 'jpc', 'jp2', 'j2k', 'wdp', 'jxr',
        'hdp', 'png', 'gif', 'webp', 'bmp', 'tif', 'tiff', 'ico'
    ],
    'STATIC_VIDEOS_EXTENSIONS': [
        'mp4', 'webm', 'flv', 'mov', 'ogv' ,'3gp' ,'3g2' ,'wmv' ,
        'mpeg' ,'flv' ,'mkv' ,'avi'
    ],
    'MAGIC_FILE_PATH': 'magic',
    'PREFIX': ''
}

CLOUDINARY_URL = os.getenv('CLOUDINARY_URL')


STATIC_URL = '/static/'
STATICFILES_STORAGE = 'cloudinary_storage.storage.StaticHashedCloudinaryStorage'
# STATIC_ROOT = 'staticfiles/'

MEDIA_URL = '/media/'
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

CLOUDINARY_STORAGE['PREFIX'] = MEDIA_URL





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


# MailTrap CONFIGURATION

MAILTRAP_APITOKEN = os.environ.get("MAILTRAP_APITOKEN")
SENDER_DEMOMAIL = os.environ.get("SENDER_DEMOMAIL")
DEFAULT_FROM_MAIL = os.environ.get("DEFAULT_FROM_MAIL")


# EMAIL CONFIGURATION

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_PORT = os.environ.get("EMAIL_PORT")
EMAIL_HOST = os.environ.get("EMAIL_HOST")
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD")
EMAIL_USE_TLS = True
EMAIL_USER_SSL = False
