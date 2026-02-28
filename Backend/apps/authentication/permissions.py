from typing import Iterable

from rest_framework import permissions

from .models import UserRole


def _has_role(user, roles: Iterable[str]) -> bool:
    return bool(user and user.is_authenticated and user.role in roles)


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view) -> bool:
        return _has_role(request.user, {UserRole.ADMIN, UserRole.SUPERADMIN})


class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view) -> bool:
        return _has_role(request.user, {UserRole.SUPERADMIN})


class IsCompanyUser(permissions.BasePermission):
    def has_permission(self, request, view) -> bool:
        return _has_role(request.user, {UserRole.COMPANY})


class IsStudentUser(permissions.BasePermission):
    def has_permission(self, request, view) -> bool:
        return _has_role(request.user, {UserRole.STUDENT})


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view) -> bool:
        if request.method in permissions.SAFE_METHODS:
            return True
        return _has_role(request.user, {UserRole.ADMIN, UserRole.SUPERADMIN})

class IsAdminOrStudent(permissions.BasePermission):
    def has_permission(self, request, view) -> bool:
        return _has_role(request.user, {UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.STUDENT})

class IsAdminOrCompany(permissions.BasePermission):
    def has_permission(self, request, view) -> bool:
        return _has_role(request.user, {UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.COMPANY})

class IsAdminOrCompanyOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view) -> bool:
        if request.method in permissions.SAFE_METHODS:
            return True
        return _has_role(request.user, {UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.COMPANY})
