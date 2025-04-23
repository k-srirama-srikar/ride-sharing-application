from rest_framework.permissions import BasePermission

class IsRider(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'rider'


class IsDriver(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'driver'


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'admin'
