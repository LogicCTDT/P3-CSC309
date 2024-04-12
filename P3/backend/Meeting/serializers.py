

from rest_framework import routers, serializers, viewsets
from Meeting.models import *

class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = ['user1', 'user2', 'start_time', 'duration']
class CreateMeetingSerializer(serializers.Serializer):
    user1 = serializers.CharField()
    user2 = serializers.CharField()
    start_time = serializers.DateTimeField()
    duration = serializers.IntegerField()
    def create(self, validated_data):
        validated_data['user1'] = User.objects.get(username=validated_data['user1'])
        validated_data['user2'] = User.objects.get(username=validated_data['user2'])
        return Meeting.objects.create(**validated_data)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password', 'is_superuser')

class SuggestedChildSerializer(serializers.Serializer):
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    preference1 = serializers.BooleanField()
    preference2 = serializers.BooleanField()
    user = serializers.CharField()
    def to_representation(self, instance):
        response_dict = dict()
    
        response_dict['start_time'] = instance[0]
        response_dict['end_time'] = instance[1]
        response_dict['preference1'] = instance[2]
        response_dict['preference2'] = instance[3]
        response_dict['user'] = instance[4]
        
        return super(SuggestedChildSerializer, self).to_representation(response_dict)
    
    
    
class SuggestedMeetingSerializer(serializers.Serializer):
    user = serializers.CharField()
    meetings = serializers.ListField(child=SuggestedChildSerializer())

    def __init__(self, *args, **kwargs):
        self.user = kwargs['context']['user'].username
        super(SuggestedMeetingSerializer, self).__init__(*args, **kwargs)
    def to_representation(self, instance):
        response_dict = dict()
        response_dict['user'] = self.user
        
        response_dict['meetings'] = instance
       
        return super(SuggestedMeetingSerializer, self).to_representation(response_dict)
    
class MovingSuggestedSerializer(serializers.Serializer):
    first = SuggestedChildSerializer()
    second = SuggestedChildSerializer()
    def to_representation(self, instance):
        
        response_dict = dict()
    
        response_dict['start_time'] = instance[0]
        response_dict['end_time'] = instance[1]
        response_dict['preference'] = instance[2]
        response_dict['user'] = instance[3]
        
        return super(MovingSuggestedSerializer, self).to_representation(response_dict)


# calendar related serializers
class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendar
        fields = ('start_date', 'end_date','start_time', 'end_time')

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = ('start_time', 'end_time', 'preference')

class AvailabilitySerializerView(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = ('id', 'start_time', 'end_time', 'preference', 'user')

class TempCalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = TempCalendar
        fields = ()

class TempAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = TempAvailability
        fields = ('start_time', 'end_time', 'preference')

class InvitedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invited
        fields = ('answered',)

class InvitedSerializerView(serializers.ModelSerializer):
    class Meta:
        model = Invited
        fields = ('answered', 'invUser', 'calendar', 'id')

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ('user', 'contact')

class CreateContactSerializer(serializers.Serializer):
    user = serializers.CharField()
    email = serializers.CharField()