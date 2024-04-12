from django.contrib import admin
from Meeting.models import *

class CalendarAdmin(admin.ModelAdmin):
    pass
class AvailabilityAdmin(admin.ModelAdmin):
    pass
class MeetingAdmin(admin.ModelAdmin):
    pass
class TempCalendarAdmin(admin.ModelAdmin):
    pass
class TempAvailabilityAdmin(admin.ModelAdmin):
    pass
class InvitedAdmin(admin.ModelAdmin):
    pass
class ContactAdmin(admin.ModelAdmin):
    pass
admin.site.register(Calendar, CalendarAdmin)
admin.site.register(Availability, AvailabilityAdmin)
admin.site.register(Meeting, MeetingAdmin)
admin.site.register(TempAvailability, TempAvailabilityAdmin)
admin.site.register(TempCalendar, TempCalendarAdmin)
admin.site.register(Invited, InvitedAdmin)
admin.site.register(Contact, ContactAdmin)