from datetime import timedelta
import datetime
from functools import total_ordering
import json
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from heapq import heappop, heappush, heapify
from rest_framework import status

from Meeting.serializers import *
from rest_framework import viewsets, permissions, generics, views
from Meeting.models import *
from rest_framework.decorators import action

# Create your views here.
class MeetingViewSet(views.APIView):
    serializer_class = MeetingSerializer
    def get_queryset(self):
        userid = self.kwargs['pk']
        user = User.objects.get(id=userid)
        obj = Meeting.objects.filter(user1=user)
        return obj
    def get(self, request, pk):
        queryset = self.get_queryset()
        res = list(queryset.values())
        for obj in res:
            username = User.objects.get(id=obj['user1_id']).username
            obj['user1_id'] = username
            username = obj['user2_id'] = User.objects.get(id=obj['user2_id']).username
            obj['user2_id'] = username
            
        return JsonResponse(res, safe=False)
                            
class CreateMeetingView(views.APIView):
    serializer_class = MeetingSerializer
    def post(self, request):
    
        serializer = CreateMeetingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

class SuggestedMeetingView(views.APIView):
    serializer_class = SuggestedMeetingSerializer
    
    def get(self, request, pk):
        # get queryset should return the list of suggested meetings to be finalized\
        calendarid = pk

        calendar = Calendar.objects.get(id=calendarid)
        # have calendar
        # get availability
        start_date = calendar.start_date
        end_date = calendar.end_date
        # initalize a dictionary with all dates between start_date and end_date
        dates = {}
        tempdates = {}
        #take start_date parse out the date and put it in the dictionary
        # take end_Date parse out the date and put it in the dictionary
        # use range to find the dates in between and put them in the dictionary
        
        current_date = start_date
        while current_date <= end_date:
    # Initialize an empty list for each date
            dates[current_date] = []
            tempdates[current_date] = []
    # Move to the next date
            current_date += timedelta(days=1)
        
        availabilities = Availability.objects.filter(calendar=calendar)
        # for each object in availability, parse time in (start_time, end_time, preference) format and place in date of dcitionary
        
        for availability in availabilities:
            date = availability.start_time.date()
            # append in 30 minute intervals
            curr_time = availability.start_time
            while curr_time.time() <= (availability.end_time - timedelta(minutes=60)).time():
                dates[date].append(((curr_time.time(), (curr_time+timedelta(minutes=60)).time(), availability.preference)))
                curr_time += timedelta(minutes=60)  
        
        # dates has all the availabilities in the original calendar. Repeat for every temp calendar and get the users
        users = {}
        tempcalendars = TempCalendar.objects.filter(calendar=calendar)
        
        for tempcalendar in tempcalendars:
            user = tempcalendar.user
            users[user] = 1
            tempavailabilities = TempAvailability.objects.filter(calendar=tempcalendar)
            for tempavailability in tempavailabilities:
                date = tempavailability.start_time.date()
                curr_time = tempavailability.start_time
                while curr_time.time() <= (tempavailability.end_time - timedelta(minutes=60)).time():
                    tempdates[date].append(((curr_time.time(), (curr_time+timedelta(minutes=60)).time(), tempavailability.preference, tempcalendar.user)))
                    curr_time += timedelta(minutes=60)
        res = []
        

        getSuggestedMeetings(dates, tempdates, users, start_date, res=res)
        # now all users and all availbites are ready, we now need to find the common availabilities for a date for all users to make meetings with
        
        
        # for each day, match all the high preferences of availabilities in dates with temp dates. If match
        # then remove user and remove/alter timeslot and continue with the algorithm. If there are multiple matches in a single day,
        # then do it by random. Next do it for high vs low, then low vs high then low vs low. 
        

        # now that I have res, I need to find five meetings with the highest matches of their true/false values. 
        print(res)
        # I will use a heap to find the five highest matches.
        heap = []
        for suggested in res:
            total = 0
            # total is + 1 for highhigh, + 0.5 for highlow, + 0.5 for lowhigh, + 0 for lowlow
            for meeting in suggested:
                if meeting[2] and meeting[3]:
                    total += 1
                elif meeting[2] and not meeting[3]:
                    total += 0.5
                elif not meeting[2] and meeting[3]:
                    total += 0.5
            # push the total and the suggested meeting to the heap
            
            heappush(heap, Wrapper(suggested, total))
        final = []
        print(heap)
        for i in range(5):
            item = heappop(heap)
            final.append(item.obj)
        # top 5 objects
        
        serializer = SuggestedMeetingSerializer(final, many=True, context={'user': calendar.user})


        return JsonResponse(serializer.data, safe=False)
    
    
def getSuggestedMeetings(dates, tempdates, users, currdate, res, currmeetings=[]):
    # should return an array of suggested meetings. 
    # each suggested meeting should be an array meeting objects, which are not committed to the database yet


    # should be recursive to find all combinations. Identify all meetings that fit on a day, create the meeting, add it to the array, 
    # remove the user from users and do this for all meetings that fit (with priority to high high, high low, low high, low low).


    # Base cases are empty user list or we have gone through all the dates. 
    
    if len(users) == 0:  
        
        res.append(currmeetings.copy())
        print(res)
        return 
    elif currdate not in dates:
        
        res.append(currmeetings.copy())
        print(res)
        return 
    else:
        
        # get all the availabilities for the current date
        
        
        # go through tempavailbities list and find all timeslots that overlap 
        while currdate in dates:
            availabilities = dates[currdate]
            tempavailabilities = tempdates[currdate]
            for i in range(len(availabilities)):
                for tempavailability in tempavailabilities:
                    availability = availabilities[i]
                    if availability[0] <= tempavailability[0] and availability[1] >= tempavailability[1] and tempavailability[3] in users:
                        a = tempavailability[3]
                        del users[tempavailability[3]]
                    # split the availability into two parts, one before the tempavailability and one after the tempavailability
                        # recursive step
                        date = datetime.datetime.combine(currdate, tempavailability[0])
                        date2 = datetime.datetime.combine(currdate, tempavailability[1])
                        currmeetings.append((date, date2, availability[2], tempavailability[2], a.username)) # append the meeting to currmeetings
            
                        dates[currdate].pop(i)
            
                        getSuggestedMeetings(dates, tempdates, users, currdate, res, currmeetings) # using update dates, users, currmeeting, 
                        #print(currmeetings)
                        
                        
                        # continue meeting list
                        dates[currdate].insert(i, availability)
                        currmeetings.pop()
                        
                        users[a] = 1
                        break
            currdate += timedelta(days=1)
        return 
                    
                        
                
@total_ordering
class Wrapper:
    def __init__(self, obj, val):
        self.val = val
        self.obj = obj
 
    def __lt__(self, other):
        return self.val > other.val
 
    def __eq__(self, other):
        return self.val == other.val
 
class MovingMeetingView(views.APIView):
    serializer_class = MovingSuggestedSerializer
    def post(self, request, pk, *args, **kwargs):
        serializer = MovingSuggestedSerializer(data=request.data)
        if serializer.is_valid():
            first = serializer.validated_data['first'] 
            second = serializer.validated_data['second']
            calendarid = pk
            # check if first and second are swapable by checking if they are available at the opposing times
            first_start = first['start_time']
            first_end = first['end_time']
            second_start = second['start_time']
            second_end = second['end_time']
            if first_start == second_start:
                return HttpResponse("Invalid swap")
            user1 = User.objects.get(username=first['user'])
            user2 = User.objects.get(username=second['user'])

            firstTemp = TempCalendar.objects.get(calendar=calendarid, user=user1.id)
            secondTemp = TempCalendar.objects.get(calendar=calendarid, user=user2.id)

            firstTempAvail = TempAvailability.objects.filter(calendar=firstTemp, start_time__gte=first_start, end_time__lte=first_end)
            secondTempAvail = TempAvailability.objects.filter(calendar=secondTemp, start_time__gte=second_start, end_time__lte=second_end)

            if firstTempAvail and secondTempAvail:
                # swap the meetings data by changing the users
                return HttpResponse("Valid Swap")
            return HttpResponse("Invalid swap")
        return HttpResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class TempAvailabilityByNameView(views.APIView):
    serializer_class = TempAvailabilitySerializer
    
    def post(self, request):
        print(request.data)
        username = request.data["username"]
        calendar1 = request.data['calendar']
        user = User.objects.get(username=username)
        calendar = Calendar.objects.get(id=calendar1)
        obj = TempCalendar.objects.get(user=user, calendar=calendar)
        avail = TempAvailability.objects.filter(calendar=obj)
        return JsonResponse(TempAvailabilitySerializer(avail, many=True).data, safe=False)
    

class ContactView(views.APIView):
    serializer_class = ContactSerializer
    def get(self, request, *args, **kwargs):
        user_id = self.kwargs['pk']
        user = User.objects.get(id=user_id)
        contacts = Contact.objects.filter(user=user)
        res = list(contacts.values())
        for obj in res:
            user = User.objects.get(id=obj['user_id'])
            obj['user_id'] = user.username
            contact = User.objects.get(id=obj['contact_id'])
            print(contact.username)
            obj['contact_username'] = contact.username
            obj['contact_email'] = contact.email
            obj['contact_id'] = contact.id

            
        return JsonResponse(res, safe=False)
    
    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = CreateContactSerializer(data=request.data)
        if serializer.is_valid():
            
            email = serializer.validated_data['email']
            contact1 = User.objects.get(email=email)
            user = User.objects.get(id=serializer.validated_data['user'])
            print(serializer.validated_data['user'])
            print(contact1.id)
            if (Contact.objects.filter(user=serializer.validated_data['user'], contact=contact1.id)):
                return HttpResponse("Contact already exists")
            contact2 = Contact.objects.create(user=user, contact=contact1)
            if serializer.validated_data['user'] == contact2.id:
                return HttpResponse("Cannot add self as contact")
            contact2.save()
            return HttpResponse("Success", status=201)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)