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