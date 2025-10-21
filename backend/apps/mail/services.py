from .providers.smtp_service import SMTPEmailService
import logging
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
import mailtrap as mt

logger = logging.getLogger(__file__)

logging.basicConfig(format="%(levelname)s: %(message)s", level=logging.DEBUG)






TOKEN = settings.MAILTRAP_APITOKEN



email_service = SMTPEmailService()

def send_email(subject: str, recipient_list: str, context: dict, template_path: str):
    logger.info(f"Sending an email")
    email_service.send_email(
        subject=subject,
        recipient_list=recipient_list,
        context=context,
        template_path=template_path
    )
    logger.info("Sent!")




def send_email_template(subject: str, recipient: str, context: dict, template_path: str):
    """Sends an email with template"""
    html_string = render_to_string(template_path, context)

    SENDER_DEMOMAIL = settings.SENDER_DEMOMAIL

    TO = settings.DEFAULT_FROM_MAIL

    mail = mt.Mail(
        sender=mt.Address(email=SENDER_DEMOMAIL),
        to=[mt.Address(email=TO)],
        subject=subject,
        html=html_string,
    )

    client = mt.MailtrapClient(token=TOKEN)
    client.send(mail=mail)

