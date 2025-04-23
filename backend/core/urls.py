from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, MeView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', MeView.as_view(), name='me'),
]

# from .views import RegisterRiderView, RegisterDriverView

# urlpatterns += [
#     path('register/rider/', RegisterRiderView.as_view(), name='register_rider'),
#     path('register/driver/', RegisterDriverView.as_view(), name='register_driver'),
# ]


# from .views import DynamicRegisterView

# urlpatterns += [
#     path('register/', DynamicRegisterView.as_view(), name='dynamic_register'),
# ]


from .views import RiderDashboardView, DriverDashboardView

urlpatterns += [
    path('rider/dashboard/', RiderDashboardView.as_view(), name='rider_dashboard'),
    path('driver/dashboard/', DriverDashboardView.as_view(), name='driver_dashboard'),
]


from .views import RequestRideView

urlpatterns += [
    path('request-ride/', RequestRideView.as_view(), name='request_ride'),
]