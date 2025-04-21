# from django.contrib import admin

# # Register your models here.
# from django.contrib.auth.admin import UserAdmin
# from .models import User  # assuming you've created this model



from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
# from django.contrib.auth.models import Group
from .models import User, Rider, Driver, RideRequest, RidePooling, Ride, Rating, Payment, DriverLocation



class UserAdmin(BaseUserAdmin):
    ordering = ['email']
    list_display = ['email', 'name', 'role', 'created_at']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('name', 'phone')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser')}),
        ('Important dates', {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'phone', 'password1', 'password2'),
        }),
    )
    search_fields = ('email',)
    filter_horizontal = ()
    list_filter = ()

admin.site.register(User, UserAdmin)
# admin.site.unregister(Group)  # optional: if you're not using Django groups


# admin.site.register(User, UserAdmin)

admin.site.register(Rider)
admin.site.register(Driver)
admin.site.register(RideRequest)
admin.site.register(RidePooling)
admin.site.register(Ride)
admin.site.register(Rating)
admin.site.register(Payment)
admin.site.register(DriverLocation)