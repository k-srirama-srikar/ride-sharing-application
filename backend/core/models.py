from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Add any extra fields if needed
    is_driver = models.BooleanField(default=False)
    is_rider = models.BooleanField(default=False)

    def __str__(self):
        return self.username
