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