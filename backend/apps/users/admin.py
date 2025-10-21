from django.contrib import admin
from .models import UserAccount, Address
from django.contrib.auth.models import Permission

admin.site.register(UserAccount)
admin.site.register(Address)
admin.site.register(Permission)
