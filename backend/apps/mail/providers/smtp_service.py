from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from ..interfaces import IEmailService



class SMTPEmailService(IEmailService):

    def __init__(self):
        pass

    def send_email(self, subject: str, recipient_list: str, context: dict, template_path: str):
        html_message = render_to_string(template_path, context)
        plain_message = strip_tags(html_message)
        email = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email="allliberianstudentsatulk",
            to=[recipient_list],

        )

        email.attach_alternative(html_message, "text/html")
        email.send()

