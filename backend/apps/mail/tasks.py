from celery import shared_task
from django_qstash import stashed_task
from .services import send_email, send_email_template
import os




MAIL_TRAP = False

@stashed_task
def send_email_task(subject: str, recipient: str, context: dict, template_path: str):
    if MAIL_TRAP:
        send_email_template(subject, recipient, context, template_path)
        return {"message": "successful"}
    send_email(subject, recipient, context, template_path)
    return {"message": "successful"}
