from django.shortcuts import render

# Create your views here.


from Meeting.serializers import *
from rest_framework import viewsets, permissions, generics
from Meeting.models import *
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# added function to grab a user's info
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

@api_view(['GET'])
def user_detail(request, user_id):
    try:
        user = get_object_or_404(User, pk=user_id)
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
        }
        return JsonResponse(user_data)
    except User.DoesNotExist:
        return JsonResponse({"error": "User does not exist"}, status=404)


@api_view(['GET'])
def allUsers(request):
    try:
        # user_data = []
        # for i in range(4):
        #     user = get_object_or_404(User, pk=(i+1))
        #     userdata = {
        #         'id': user.id,
        #         'username': user.username,
        #         'email': user.email,
        #     }
        #     user_data.append(userdata)
        users = User.objects.all()
        user_data = []
        for user in users:
            user_data.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
            })
        return JsonResponse(user_data, safe=False)
    except User.DoesNotExist:
        return JsonResponse({"error": "No users found"}, status=404)







@api_view(['GET', 'PUT'])
def MainCalendar(request, id):
    try:
        cal = Calendar.objects.get(pk=id)
    except Calendar.DoesNotExist:
        return(Response(status=status.HTTP_404_NOT_FOUND))

    if request.method == 'GET':
        serializer = CalendarSerializer(cal)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = CalendarSerializer(cal, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def MainCalendarCreate(request, user):
    if request.method == 'POST':
        serializer = CalendarSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.get(id=user)
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def AvailabilityCreate(request, id):
    if request.method == 'POST':
        serializer = AvailabilitySerializer(data=request.data)
        if serializer.is_valid():
            cal = Calendar.objects.get(pk=id)
            serializer.save(calendar=cal)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def AvailabilityView(request, id):
    try:
        av = Availability.objects.get(pk=id)
    except Availability.DoesNotExist:
        return(Response(status=status.HTTP_404_NOT_FOUND))

    if request.method == 'GET':
        serializer = AvailabilitySerializer(av)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = AvailabilitySerializer(av, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        av.delete()
        return(Response(status=status.HTTP_204_NO_CONTENT))



@api_view(['GET', 'PUT'])
def TempCalendarView(request, id):
    try:
        cal = TempCalendar.objects.get(pk=id)
    except TempCalendar.DoesNotExist:
        return(Response(status=status.HTTP_404_NOT_FOUND))

    if request.method == 'GET':
        serializer = TempCalendarSerializer(cal)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = TempCalendarSerializer(cal, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def TempCalendarCreate(request, calid, user):
    if request.method == 'POST':
        serializer = TempCalendarSerializer(data=request.data)
        if serializer.is_valid():
            cal = Calendar.objects.get(pk=calid)
            user = User.objects.get(id=user)
            serializer.save(calendar=cal, user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def TempAvailabilityCreate(request, id):
    if request.method == 'POST':
        serializer = TempAvailabilitySerializer(data=request.data)
        if serializer.is_valid():
            cal = TempCalendar.objects.get(pk=id)
            serializer.save(calendar=cal)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
def TempAvailabilityView(request, id):
    try:
        av = TempAvailability.objects.get(pk=id)
    except TempAvailability.DoesNotExist:
        return(Response(status=status.HTTP_404_NOT_FOUND))

    if request.method == 'GET':
        serializer = TempAvailabilitySerializer(av)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = TempAvailabilitySerializer(av, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def AllAvailabilities(request, calendar_id):
    try:
        avs = Availability.objects.filter(calendar=calendar_id)
        serializer = AvailabilitySerializerView(avs, many=True)
        return Response(serializer.data)
    except Event.DoesNotExist:
        return Response({"error": "Calendar does not exist or has no availabilities"}, status=404)

@api_view(['GET'])
def AllTempAvailabilities(request, tempcalendar_id):
    try:
        avs = TempAvailability.objects.filter(calendar_id=tempcalendar_id)
        serializer = TempAvailabilitySerializer(avs, many=True)
        return Response(serializer.data)
    except Event.DoesNotExist:
        return Response({"error": "Calendar does not exist or has no availabilities"}, status=404)



@api_view(['POST'])
def InvitedCreate(request, calid, user):
    if request.method == 'POST':
        serializer = InvitedSerializer(data=request.data)
        if serializer.is_valid():
            cal = Calendar.objects.get(pk=calid)
            user = User.objects.get(id=user)
            serializer.save(calendar=cal, invUser=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def InvitedView(request, id):
    try:
        av = Invited.objects.get(pk=id)
    except Invited.DoesNotExist:
        return(Response(status=status.HTTP_404_NOT_FOUND))

    if request.method == 'GET':
        serializer = InvitedSerializer(av)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = InvitedSerializer(av, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        av.delete()
        return(Response(status=status.HTTP_204_NO_CONTENT))

@api_view(['GET'])
def AllInvited(request, calendar_id):
    try:
        invs = Invited.objects.filter(calendar=calendar_id)
        serializer = InvitedSerializerView(invs, many=True)
        return Response(serializer.data)
    except Event.DoesNotExist:
        return Response({"error": "Calendar does not exist or has no availabilities"}, status=404)
