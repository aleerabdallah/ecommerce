# This will make sure the app is always imported when
# Django starts so that shared_task will use this app.
# from .celery import app as celery_app

# __all__ = ('celery_app',)


# from dotenv import load_dotenv
# import os

# load_dotenv()



# DEBUG = os.environ.get("DEBUG")

# if DEBUG:
#     from .settings.dev import *

# else:
#     from .settings.prod import *
