# Generated by Django 4.2 on 2024-03-12 16:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Meeting', '0002_alter_meeting_start_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='availability',
            name='end_time',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='availability',
            name='start_time',
            field=models.DateTimeField(),
        ),
    ]