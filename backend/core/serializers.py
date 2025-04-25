from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'name', 'phone', 'password', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            phone=validated_data['phone'],
            name=validated_data['name'],
            password=validated_data['password']
        )
        user.role = validated_data.get('role', 'rider')
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'phone', 'role', 'created_at']


from .models import Rider, Driver
# from rest_framework import serializers

class RiderProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rider
        fields = ['preferred_payment_method', 'preferred_ride_type']

    def create(self, validated_data):
        user = self.context['request'].user
        return Rider.objects.create(user=user, **validated_data)


class DriverProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ['vehicle_number', 'vehicle_model', 'seat_capacity']

    def create(self, validated_data):
        user = self.context['request'].user
        return Driver.objects.create(user=user, **validated_data)


class DynamicRegisterSerializer(serializers.ModelSerializer):
    # Additional profile fields
    preferred_payment_method = serializers.CharField(required=False)
    preferred_ride_type = serializers.CharField(required=False)

    vehicle_number = serializers.CharField(required=False)
    vehicle_model = serializers.CharField(required=False)
    seat_capacity = serializers.IntegerField(required=False)

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'email', 'name', 'phone', 'password', 'role',
            # Rider fields
            'preferred_payment_method', 'preferred_ride_type',
            # Driver fields
            'vehicle_number', 'vehicle_model', 'seat_capacity',
        ]

    def create(self, validated_data):
        role = validated_data.get('role', 'rider')
        password = validated_data.pop('password')

        # Extract user fields
        user_data = {
            key: validated_data.pop(key)
            for key in ['email', 'name', 'phone', 'role']
        }

        user = User.objects.create(**user_data)
        user.set_password(password)
        user.save()

        if role == 'rider':
            Rider.objects.create(
                user=user,
                preferred_payment_method=validated_data.get('preferred_payment_method', ''),
                preferred_ride_type=validated_data.get('preferred_ride_type', '')
            )
        elif role == 'driver':
            Driver.objects.create(
                user=user,
                vehicle_number=validated_data.get('vehicle_number'),
                vehicle_model=validated_data.get('vehicle_model'),
                seat_capacity=validated_data.get('seat_capacity')
            )

        return user
    



from .models import RideRequest

class RideRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RideRequest
        fields = ['source', 'destination', 'pooling']

    def create(self, validated_data):
        rider = self.context['request'].user.rider
        return RideRequest.objects.create(rider=rider, **validated_data)
    

from .models import Rating

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['ride', 'rider', 'driver', 'rating', 'feedback']


from .models import Payment
from rest_framework import serializers

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['ride', 'rider', 'amount', 'payment_method', 'status']



from rest_framework import serializers
from .models import Ride

class RideSerializer(serializers.ModelSerializer):
    driver_name = serializers.CharField(source='driver.user.name', read_only=True)
    rider_name = serializers.CharField(source='rider.user.name', read_only=True)

    class Meta:
        model = Ride
        fields = [
            'id',
            'driver_name',
            'rider_name',
            'source',
            'destination',
            'route',
            'status',
            'started_at',
            'completed_at',
            'pooling',
        ]



from rest_framework import serializers
from .models import DriverLocation, RideRequest, Ride, Driver

class DriverLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverLocation
        fields = ['location']

class RideConfirmSerializer(serializers.Serializer):
    request_id = serializers.IntegerField()
    driver_id = serializers.IntegerField()

class RideCancelSerializer(serializers.Serializer):
    request_id = serializers.IntegerField()
