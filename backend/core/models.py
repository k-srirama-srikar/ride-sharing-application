# from django.db import models

# Create your models here.
# from django.contrib.auth.models import AbstractUser
# from django.db import models

# from django.contrib.gis.db import models
# from django.utils import timezone

# class User(AbstractUser):
#     # Add any extra fields if needed
#     is_driver = models.BooleanField(default=False)
#     is_rider = models.BooleanField(default=False)
#     location = models.PointField(null=True, blank=True, geography=True)
#     def __str__(self):
#         return self.username










from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from django.contrib.gis.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, phone, name, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        if not phone:
            raise ValueError('Users must have a phone number')

        user = self.model(
            email=self.normalize_email(email),
            phone=phone,
            name=name,
            is_active=True,
            is_staff=False,
            is_superuser=False,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, phone, name, password):
        user = self.create_user(email, phone, name, password)
        user.role = 'admin'
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):  # ✅ PermissionsMixin adds groups, permissions, etc.
    ROLE_CHOICES = (
        ('rider', 'Rider'),
        ('driver', 'Driver'),
        ('admin', 'Admin'),
    )

    name = models.CharField(max_length=100, default="Unknown")
    phone = models.CharField(max_length=15, unique=True, default='9999999999')
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='rider')
    created_at = models.DateTimeField(default=timezone.now)

    # ✅ Add these permission flags
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone', 'name']

    objects = UserManager()

    def __str__(self):
        return self.email


class Rider(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    preferred_payment_method = models.CharField(max_length=50, blank=True, null=True)
    preferred_ride_type = models.CharField(max_length=50, blank=True, null=True)
    ride_count = models.IntegerField(default=0)
    last_ride_at = models.DateTimeField(blank=True, null=True)

class Driver(models.Model):
    STATUS_CHOICES = (
        ('available', 'Available'),
        ('on_ride', 'On Ride'),
        ('offline', 'Offline'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    vehicle_number = models.CharField(max_length=20, unique=True)
    vehicle_model = models.CharField(max_length=50)
    seat_capacity = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')

from django.contrib.gis.db import models
from django.contrib.postgres.indexes import GistIndex

class DriverLocation(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    location = models.PointField()
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        indexes = [
            GistIndex(fields=["location"]),
        ]

class RideRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('matched', 'Matched'),
        ('cancelled', 'Cancelled'),
    )

    rider = models.ForeignKey(Rider, on_delete=models.CASCADE)
    source = models.PointField()
    destination = models.PointField()
    pooling = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        indexes = [
            models.Index(fields=["status"]),
        ]

class RidePooling(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    waypoints = models.LineStringField(blank=True, null=True)
    total_seats = models.IntegerField()
    available_seats = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

class Ride(models.Model):
    STATUS_CHOICES = (
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    rider = models.ForeignKey(Rider, on_delete=models.CASCADE)
    source = models.PointField()
    destination = models.PointField()
    route = models.LineStringField(blank=True, null=True)
    pooling = models.ForeignKey(RidePooling, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ongoing')
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        indexes = [
            GistIndex(fields=["source"]),
            GistIndex(fields=["destination"]),
        ]

class Rating(models.Model):
    ride = models.ForeignKey(Ride, on_delete=models.CASCADE)
    rider = models.ForeignKey(Rider, on_delete=models.CASCADE)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    rating = models.IntegerField()
    feedback = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Payment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )

    ride = models.ForeignKey(Ride, on_delete=models.CASCADE)
    rider = models.ForeignKey(Rider, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
