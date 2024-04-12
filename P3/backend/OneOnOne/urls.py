"""
URL configuration for OneonOne project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path

from rest_framework import routers
from Meeting.views import MeetingViewSet, UserViewSet, SuggestedMeetingView, MovingMeetingView, TempAvailabilityByNameView, CreateMeetingView, ContactView
from Auth.views import LoginView, LogoutView, RegisterView, ProfileView, EditView, ContactsView, ContactAddView, ContactDeleteView
from Booking import views



router = routers.DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/<int:pk>/meetings/', MeetingViewSet.as_view(), name='meeting'),
    path('api/', include(router.urls)),
    path('api/<int:pk>/suggestedmeetings/', SuggestedMeetingView.as_view(), name='suggestedmeeting'),
    path('api/<int:pk>/movingsuggested/', MovingMeetingView.as_view(), name='movingsuggested'),
    path('api/tempavailbitiesbyname/', TempAvailabilityByNameView.as_view(), name='tempavailabilitiesbyname'),
    path('api/token/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/profile/', ProfileView.as_view(), name='profile'),
    path('api/edit/', EditView.as_view(), name='edit'),
    path('api/contacts/add/', ContactAddView.as_view(), name='contact-add'),
    path('api/contacts/<int:pk>/delete/', ContactDeleteView.as_view(), name='contact-delete'),
    path('api/createmeeting/', CreateMeetingView.as_view(), name='create-meeting'),
    path('api/<int:pk>/contacts/', ContactView.as_view(), name='contacts'),
    # all calendar endpoints
    path('api/calendar/<int:id>/', views.MainCalendar),
    path('api/<int:user>/calendarpost/', views.MainCalendarCreate),
    path('api/<int:id>/availabilitypost/', views.AvailabilityCreate),
    path('api/availability/<int:id>/', views.AvailabilityView),
    path('api/tempcalendar/<int:id>/', views.TempCalendarView),
    path('api/<int:user>/tempcalendarpost/<int:calid>/', views.TempCalendarCreate),
    path('api/<int:id>/tempavailabilitypost/', views.TempAvailabilityCreate),
    path('api/tempavailability/<int:id>/', views.TempAvailabilityView),
    path('api/calendar/<int:calendar_id>/availabilities/', views.AllAvailabilities),
    path('api/tempcalendar/<int:tempcalendar_id>/tempavailabilites/', views.AllTempAvailabilities),
    path('api/invited/<int:id>/', views.InvitedView),
    path('api/<int:user>/invitedpost/<int:calid>/', views.InvitedCreate),
    path('api/calendar/<int:calendar_id>/invited/', views.AllInvited),

    path('api/user/<int:user_id>/', views.user_detail),
    path('api/allUsers/', views.allUsers),



]

