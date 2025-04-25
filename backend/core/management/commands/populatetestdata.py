from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
from core.models import User, Driver, DriverLocation, Rider
from django.utils import timezone


class Command(BaseCommand):
    help = "Populates test data: riders, drivers, and driver locations"

    def handle(self, *args, **kwargs):
        # Create Riders
        for i in range(1, 16):
            email = f"rider{i}@test.com"
            if not User.objects.filter(email=email).exists():
                user = User.objects.create(
                    **{"email":email,
                    "phone":f"78000000{i:02d}",
                    "name":f"Rider {i}",
                    "role":"rider"}
                )
                # user = User.objects.create(**user_data)
                user.set_password("test1234")
                user.save()
                Rider.objects.create(
                    user=user,
                    preferred_payment_method="UPI",
                    preferred_ride_type="standard"
                )
                self.stdout.write(self.style.SUCCESS(f"Created Rider {email}"))

        # Create Drivers with location
        driver_locations = [
            (77.6643, 12.9584),  # Whitefield
            (77.6309, 12.9762),  # Indiranagar
            (77.5534, 13.0217),  # Hebbal
            (77.5671, 12.9085),  # Jayanagar
            (77.4975, 12.9559),  # Electronic City
            (77.5946, 12.9716),  # Bangalore (Central - as in your example)
            (77.5996, 12.9750),
            (77.5800, 12.9700),
            (77.6100, 12.9800),
            (77.6200, 12.9600),
            (77.5325, 12.9850),  # Malleswaram
            (77.7041, 13.0015),  # Marathahalli
            (77.5771, 13.0458),  # Yelahanka
            (77.5199, 12.9164),  # Banashankari
            (77.6412, 12.9945),  # Koramangala
        ]

        for i, coords in enumerate(driver_locations, start=1):
            email = f"driver{i}@test.com"
            if not User.objects.filter(email=email).exists():
                user = User.objects.create(
                    **{"email":email,
                    "phone":f"87000000{i:02d}",
                    "name":f"Driver {i}",
                    "role":"driver"}
                )
                user.set_password("test1234")
                user.save()
                driver = Driver.objects.create(
                    user=user,
                    vehicle_number=f"KA01AB{i:03d}",
                    vehicle_model="Toyota Prius",
                    seat_capacity=4,
                    status="available"
                )
                DriverLocation.objects.create(
                    driver=driver,
                    location=Point(coords[0], coords[1])  # (lng, lat)
                )
                self.stdout.write(self.style.SUCCESS(f"Created Driver {email} with location {coords}"))

        self.stdout.write(self.style.SUCCESS("Test data populated successfully."))
