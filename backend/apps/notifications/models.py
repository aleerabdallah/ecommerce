from django.db import models


class NotificationChannel(models.Model):
    """Delivery methods for notifications"""

    EMAIL = "email"
    IN_APP = "in_app"
    SMS = "sms"
    PUSH = "push"

    CHANNEL_CHOICES = [
        (EMAIL, "Email"),
        (IN_APP, "In-App Notification"),
        (SMS, "SMS Text Message"),
        (PUSH, "Push Notification"),
    ]

    name = models.CharField(max_length=50, choices=CHANNEL_CHOICES, unique=True)
    requires_opt_in = models.BooleanField(default=False)
    enabled_globally = models.BooleanField(default=True)

    def __str__(self):
        return self.get_name_display()

    def get_name_display(self):
        return self.name
