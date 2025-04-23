# from django.shortcuts import render

# # Create your views here.

from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer
from .models import User
from .serializers import DynamicRegisterSerializer
# from rest_framework.permissions import IsAuthenticated

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = DynamicRegisterSerializer

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)



# from .serializers import RiderProfileSerializer, DriverProfileSerializer

# class RegisterRiderView(generics.CreateAPIView):
#     serializer_class = RiderProfileSerializer
#     permission_classes = [IsAuthenticated]

#     def perform_create(self, serializer):
#         serializer.save()


# class RegisterDriverView(generics.CreateAPIView):
#     serializer_class = DriverProfileSerializer
#     permission_classes = [IsAuthenticated]

#     def perform_create(self, serializer):
#         serializer.save()

# from .models import User

# class DynamicRegisterView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     permission_classes = [permissions.AllowAny]
#     serializer_class = DynamicRegisterSerializer


from .permissions import IsRider, IsDriver

class RiderDashboardView(APIView):
    permission_classes = [IsRider]

    def get(self, request):
        rider = request.user.rider  # since OneToOne
        return Response({
            "message": "Welcome Rider!",
            "payment_preference": rider.preferred_payment_method,
            "ride_count": rider.ride_count
        })


class DriverDashboardView(APIView):
    permission_classes = [IsDriver]

    def get(self, request):
        driver = request.user.driver
        return Response({
            "message": "Welcome Driver!",
            "vehicle": driver.vehicle_model,
            "status": driver.status
        })


from .models import RideRequest
from .serializers import RideRequestSerializer

# class RequestRideView(generics.CreateAPIView):
#     queryset = RideRequest.objects.all()
#     serializer_class = RideRequestSerializer
#     permission_classes = [IsRider]


class RequestRideView(generics.CreateAPIView):
    queryset = RideRequest.objects.all()
    serializer_class = RideRequestSerializer
    permission_classes = [IsRider]

    def perform_create(self, serializer):
        ride_request = serializer.save()
        match_ride_python(self.request.user.rider)


from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import GEOSGeometry
from django.contrib.gis.measure import D
from django.utils.timezone import now
from rest_framework.exceptions import APIException
from .models import RideRequest, RidePooling, Ride, Driver

def match_ride_python(rider_id):
    try:
        request = RideRequest.objects.get(rider_id=rider_id, status='pending')
    except RideRequest.DoesNotExist:
        raise APIException(f"No pending ride request for rider {rider_id}")

    v_source = request.source
    v_destination = request.destination
    v_pooling = request.pooling

    # POOLING: Check for nearby active pools
    if v_pooling:
        nearby_pool = (
            RidePooling.objects
            .filter(status='active', available_seats__gt=0)
            .filter(waypoints__dwithin=(v_source, D(m=1000)))  # Within 1km of pickup
            .order_by('created_at')
            .first()
        )

        if nearby_pool:
            ride = Ride.objects.create(
                driver=nearby_pool.driver,
                rider=request.rider,
                source=v_source,
                destination=v_destination,
                pooling=nearby_pool,
                status='ongoing',
                started_at=now()
            )

            nearby_pool.available_seats -= 1
            if nearby_pool.available_seats == 0:
                nearby_pool.status = 'full'
            nearby_pool.save()

            request.status = 'matched'
            request.save()

            # Mark driver as on ride (if this is first rider, else already marked)
            if nearby_pool.driver.status == 'available':
                nearby_pool.driver.status = 'on_ride'
                nearby_pool.driver.save()

            return ride.id

        # No pool found — create new pooling session
        driver = Driver.objects.filter(status='available').order_by('id').first()
        if not driver:
            raise APIException("No available drivers to create new pool.")

        new_pool = RidePooling.objects.create(
            driver=driver,
            waypoints=None,  # Can later update with real route
            total_seats=4,
            available_seats=3,
            status='active'
        )

        ride = Ride.objects.create(
            driver=driver,
            rider=request.rider,
            source=v_source,
            destination=v_destination,
            pooling=new_pool,
            status='ongoing',
            started_at=now()
        )

        request.status = 'matched'
        request.save()
        driver.status = 'on_ride'
        driver.save()

        return ride.id

    # NON-POOLING
    else:
        driver = (
            Driver.objects
            .filter(status='available', driverlocation__location__dwithin=(v_source, D(m=5000)))
            .annotate(distance=Distance('driverlocation__location', v_source))
            .order_by('distance')
            .first()
        )

        if not driver:
            raise APIException("No nearby drivers found.")

        ride = Ride.objects.create(
            driver=driver,
            rider=request.rider,
            source=v_source,
            destination=v_destination,
            status='ongoing',
            started_at=now()
        )

        request.status = 'matched'
        request.save()
        driver.status = 'on_ride'
        driver.save()

        return ride.id
