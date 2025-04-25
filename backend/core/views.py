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



class GetNearbyDriversView(APIView):
    permission_classes = [IsRider]

    def get(self, request):
        rider = request.user.rider
        try:
            request_obj = RideRequest.objects.get(rider=rider, status='pending')
        except RideRequest.DoesNotExist:
            return Response({"error": "No pending ride request"}, status=404)

        source = request_obj.source
        drivers = (
            Driver.objects
            .filter(status='available', driverlocation__location__dwithin=(source, D(km=5)))
            .annotate(distance=Distance('driverlocation__location', source))
            .order_by('distance')[:5]
        )

        return Response([
            {
                "driver_id": driver.id,
                "vehicle_model": driver.vehicle_model,
                "vehicle_number": driver.vehicle_number,
                "distance_km": round(driver.distance.km, 2)
            }
            for driver in drivers
        ])




class AssignDriverView(APIView):
    permission_classes = [IsRider]

    def post(self, request):
        driver_id = request.data.get("driver_id")
        if not driver_id:
            return Response({"error": "Driver ID required"}, status=400)

        rider = request.user.rider
        try:
            ride_request = RideRequest.objects.get(rider=rider, status='pending')
        except RideRequest.DoesNotExist:
            return Response({"error": "No pending ride request"}, status=404)

        driver = Driver.objects.filter(id=driver_id, status='available').first()
        if not driver:
            return Response({"error": "Driver not available"}, status=400)

        ride = Ride.objects.create(
            driver=driver,
            rider=rider,
            source=ride_request.source,
            destination=ride_request.destination,
            status='ongoing',
            started_at=now()
        )

        ride_request.status = 'matched'
        ride_request.save()

        driver.status = 'on_ride'
        driver.save()

        return Response({
            "ride_id": ride.id,
            "driver": driver.user.name,
            "vehicle": driver.vehicle_model
        })








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



from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Ride, RidePooling, Driver
from django.utils.timezone import now

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_ride_view(request, ride_id):
    try:
        ride = Ride.objects.get(id=ride_id, status='ongoing')
    except Ride.DoesNotExist:
        return Response({"error": "Ride not found or already completed."}, status=404)

    driver = ride.driver
    pooling = ride.pooling

    # Mark ride as completed
    ride.status = 'completed'
    ride.completed_at = now()
    ride.save()

    # If part of pooling, check if it's the last ride in the pool
    if pooling:
        ongoing_rides = Ride.objects.filter(pooling=pooling, status='ongoing').count()
        if ongoing_rides == 0:
            pooling.status = 'completed'
            pooling.save()

    # Check if driver has any other ongoing rides
    ongoing = Ride.objects.filter(driver=driver, status='ongoing').count()
    if ongoing == 0:
        driver.status = 'available'
        driver.save()

    return Response({"message": f"Ride {ride_id} marked as completed."}, status=200)




from .models import Rating, Ride
from .serializers import RatingSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, serializers

class SubmitRatingView(generics.CreateAPIView):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        ride = serializer.validated_data['ride']
        if ride.status != 'completed':
            raise serializers.ValidationError("You can only rate completed rides.")
        if Rating.objects.filter(ride=ride, rider=serializer.validated_data['rider']).exists():
            raise serializers.ValidationError("You have already rated this ride.")

        serializer.save()


from .models import Payment, Ride
from .serializers import PaymentSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

class SubmitPaymentView(generics.CreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        ride = serializer.validated_data['ride']
        if ride.status != 'completed':
            raise ValidationError("You can only pay for completed rides.")

        if Payment.objects.filter(ride=ride).exists():
            raise ValidationError("Payment for this ride already exists.")

        serializer.save(status='completed')  # Simulate successful payment


from rest_framework.generics import ListAPIView
from .models import Ride
from .serializers import RideSerializer
from .permissions import IsRider

class RiderRideHistoryView(ListAPIView):
    serializer_class = RideSerializer
    permission_classes = [IsRider]

    def get_queryset(self):
        rider = self.request.user.rider
        status = self.request.query_params.get('status')  # optional filter
        queryset = Ride.objects.filter(rider=rider)
        if status:
            queryset = queryset.filter(status=status)
        return queryset.order_by('-started_at')


from .permissions import IsDriver

class DriverRideHistoryView(ListAPIView):
    serializer_class = RideSerializer
    permission_classes = [IsDriver]

    def get_queryset(self):
        driver = self.request.user.driver
        status = self.request.query_params.get('status')
        queryset = Ride.objects.filter(driver=driver)
        if status:
            queryset = queryset.filter(status=status)
        return queryset.order_by('-started_at')


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Ride
from rest_framework.exceptions import NotFound

class RideStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, ride_id):
        try:
            ride = Ride.objects.get(id=ride_id)
        except Ride.DoesNotExist:
            raise NotFound("Ride not found")

        return Response({
            "ride_id": ride.id,
            "driver": ride.driver.user.name,
            "rider": ride.rider.user.name,
            "source": ride.source.wkt,
            "destination": ride.destination.wkt,
            "status": ride.status,
            "started_at": ride.started_at,
            "completed_at": ride.completed_at
        })


from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import RideRequest, DriverLocation, Driver
from django.contrib.gis.geos import GEOSGeometry

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_ride_request(request):
    rider = request.user.rider
    source = request.data.get('source')  # {'lat': 12.9, 'lng': 77.6}
    destination = request.data.get('destination')
    pooling = request.data.get('pooling', False)

    if not source or not destination:
        return Response({"error": "Source and destination required"}, status=400)

    # source_point = f'POINT({source["lng"]} {source["lat"]})'
    # destination_point = f'POINT({destination["lng"]} {destination["lat"]})'

    try:
        source_point = GEOSGeometry(f'POINT({source["lng"]} {source["lat"]})', srid=4326)
        destination_point = GEOSGeometry(f'POINT({destination["lng"]} {destination["lat"]})', srid=4326)
    except Exception as e:
        return Response({"error": f"Invalid coordinates: {e}"}, status=400)

    ride_request = RideRequest.objects.create(
        rider=rider,
        source=source_point,
        destination=destination_point,
        pooling=pooling,
    )

    # nearby_drivers = (
    #     Driver.objects
    #     .filter(status='available', driverlocation__location__dwithin=(source_point, D(km=5)))
    #     .annotate(distance=Distance('driverlocation__location', source_point))
    #     .order_by('distance')[:5]
    # )


    nearby_drivers = (
        Driver.objects
        .filter(status='available')
        .annotate(distance=Distance('driverlocation__location', source_point))
        .filter(distance__lte=5000)  # 5 km
        .order_by('distance')[:5]
    )


    driver_list = [
        {
            "driver_id": driver.id,
            "name": driver.user.name,
            "distance_km": round(driver.distance.km, 2)
        }
        for driver in nearby_drivers
    ]

    return Response({
        "request_id": ride_request.id,
        "available_drivers": driver_list
    })



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_ride_request(request):
    rider = request.user.rider
    driver_id = request.data.get('driver_id')
    request_id = request.data.get('request_id')

    try:
        ride_request = RideRequest.objects.get(id=request_id, rider=rider, status='pending')
    except RideRequest.DoesNotExist:
        return Response({"error": "Invalid or already matched request"}, status=404)

    try:
        driver = Driver.objects.get(id=driver_id, status='available')
    except Driver.DoesNotExist:
        return Response({"error": "Driver not available"}, status=404)

    # Create the ride
    ride = Ride.objects.create(
        driver=driver,
        rider=rider,
        source=ride_request.source,
        destination=ride_request.destination,
        status='ongoing'
    )

    ride_request.status = 'matched'
    ride_request.save()

    driver.status = 'on_ride'
    driver.save()

    return Response({
        "message": "Ride confirmed",
        "ride_id": ride.id,
        "driver": driver.user.name
    })




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_ride_request(request):
    rider = request.user.rider
    request_id = request.data.get('request_id')

    updated = RideRequest.objects.filter(id=request_id, rider=rider, status='pending').update(status='cancelled')
    
    if updated:
        return Response({"message": "Ride request cancelled"})
    else:
        return Response({"error": "Request already matched or not found"}, status=400)




# views.py (core/views.py)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.gis.geos import Point
from django.utils.timezone import now
from rest_framework import status

from .permissions import IsDriver, IsRider
from .models import DriverLocation, RideRequest, Driver, Ride, RidePooling
from .serializers import DriverLocationSerializer


class UpdateDriverLocationView(APIView):
    permission_classes = [IsDriver]

    def post(self, request):
        driver = request.user.driver
        point = Point(request.data["lng"], request.data["lat"], srid=4326)
        DriverLocation.objects.update_or_create(driver=driver, defaults={"location": point})
        return Response({"status": "location updated"})


class ConfirmRideView(APIView):
    permission_classes = [IsRider]

    def post(self, request):
        try:
            ride_request_id = request.data.get("request_id")
            driver_id = request.data.get("driver_id")
            ride_request = RideRequest.objects.get(id=ride_request_id, rider=request.user.rider, status='pending')
            driver = Driver.objects.get(id=driver_id)
        except (RideRequest.DoesNotExist, Driver.DoesNotExist):
            return Response({"error": "Invalid request or driver."}, status=404)

        ride = Ride.objects.create(
            driver=driver,
            rider=ride_request.rider,
            source=ride_request.source,
            destination=ride_request.destination,
            status='ongoing',
            started_at=now()
        )

        ride_request.status = 'matched'
        ride_request.save()

        driver.status = 'on_ride'
        driver.save()

        return Response({"status": "ride confirmed", "ride_id": ride.id})


class CancelRideView(APIView):
    permission_classes = [IsRider]

    def post(self, request):
        try:
            ride_request_id = request.data.get("request_id")
            ride_request = RideRequest.objects.get(id=ride_request_id, rider=request.user.rider)
        except RideRequest.DoesNotExist:
            return Response({"error": "Ride request not found."}, status=404)

        ride_request.status = 'cancelled'
        ride_request.save()

        return Response({"status": "ride request cancelled"})
    
