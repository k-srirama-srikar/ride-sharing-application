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


from .views import RequestRideView, GetNearbyDriversView, AssignDriverView

urlpatterns += [
    path('request-ride/', RequestRideView.as_view(), name='request_ride'),
    path("ride/nearby-drivers/", GetNearbyDriversView.as_view()),
    path("ride/assign-driver/", AssignDriverView.as_view()),
]


from .views import complete_ride_view

urlpatterns += [
    path('rides/<int:ride_id>/complete/', complete_ride_view),
]


from .views import SubmitRatingView

urlpatterns += [
    path('rides/rate/', SubmitRatingView.as_view(), name='rate-ride'),
]


from .views import SubmitPaymentView

urlpatterns += [
    path('rides/pay/', SubmitPaymentView.as_view(), name='ride-payment'),
]


from .views import RiderRideHistoryView, DriverRideHistoryView

urlpatterns += [
    path('rides/history/rider/', RiderRideHistoryView.as_view(), name='rider-ride-history'),
    path('rides/history/driver/', DriverRideHistoryView.as_view(), name='driver-ride-history'),
]

from .views import RideStatusView
# path("rides/<int:ride_id>/status/", RideStatusView.as_view(), name="ride-status"),


from .views import initiate_ride_request, confirm_ride_request, cancel_ride_request

urlpatterns += [
    path("rides/<int:ride_id>/status/", RideStatusView.as_view(), name="ride-status"),
    path('riderequest/initiate/', initiate_ride_request),
    path('riderequest/confirm/', confirm_ride_request),
    path('riderequest/cancel/', cancel_ride_request),
]

from django.urls import path
from .views import (
    UpdateDriverLocationView,
    ConfirmRideView,
    CancelRideView,
)

urlpatterns += [
    path("driver/update-location/", UpdateDriverLocationView.as_view(), name="update-driver-location"),
    path("ride/confirm/", ConfirmRideView.as_view(), name="confirm-ride"),
    path("ride/cancel/", CancelRideView.as_view(), name="cancel-ride"),
]
