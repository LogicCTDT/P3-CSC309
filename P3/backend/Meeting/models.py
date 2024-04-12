from django.db import models
from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth.models import User

# Create your models here.

class Calendar(models.Model):
    start_date = models.DateField(blank=False, null=False)
    end_date = models.DateField(blank=False, null=False)
    start_time = models.TimeField(blank=False, null=False)
    end_time = models.TimeField(blank=False, null=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)


class Availability(models.Model):
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)
    preference = models.BooleanField()
    start_time = models.DateTimeField(blank=False, null=False)
    end_time = models.DateTimeField(blank=False, null=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=4)

class Meeting(models.Model):
    user1 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user1')
    user2 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user2')
    start_time = models.DateTimeField(blank=False, null=False)
    duration = models.IntegerField(default=30, validators=[
            MinValueValidator(0)
        ])
    
class TempCalendar(models.Model):
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

class TempAvailability(models.Model):
    calendar = models.ForeignKey(TempCalendar,on_delete=models.CASCADE)
    preference = models.BooleanField()
    start_time = models.DateTimeField(blank=False, null=False)
    end_time = models.DateTimeField(blank=False, null=False)

class Invited(models.Model):
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)
    answered = models.BooleanField()
    invUser = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='invUser', default=4)

class Contact(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user')
    contact = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='contact')
