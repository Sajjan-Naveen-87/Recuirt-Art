"""
Views for Accounts App

This module contains API views for user authentication including
registration, login, OTP verification, and profile management.
"""

from django.contrib.auth import get_user_model, authenticate, login, logout
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from social_django.utils import psa
from accounts.otps import OTP
from accounts.permissions import (
    IsSuperuser,
    IsAdmin,
    IsUser,
    IsAdminOrUser,
    IsAdminOrSuperuser,
    CanViewResume,
    CanViewOwnProfile,
    CanApplyForJobs,
)
from accounts.serializers import (
    UserRegistrationSerializer,
    OTPVerificationSerializer,
    OTPSendSerializer,
    UserLoginSerializer,
    UserSerializer,
    UserUpdateSerializer,
    PasswordChangeSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    GoogleAuthSerializer,
)
from jobs.models import JobApplication
from jobs.serializers import JobApplicationSummarySerializer
from accounts.services import send_otp

User = get_user_model()


class RegistrationView(APIView):
    """
    API view for user registration.

    POST: Register a new user with email, mobile, and password.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """Register a new user."""
        serializer = UserRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            # Generate and send OTP for mobile verification
            otp = OTP.generate_otp(
                mobile=user.mobile,
                otp_type='registration',
                user=user,
                email=user.email
            )
            send_otp(user.mobile, otp.otp_code)

            return Response({
                'message': 'User registered successfully.',
                'user': UserSerializer(user).data,
                'requires_otp_verification': True
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OTPVerificationView(APIView):
    """
    API view for OTP verification.

    POST: Verify OTP for mobile number.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """Verify OTP for mobile number."""
        serializer = OTPVerificationSerializer(data=request.data)

        if serializer.is_valid():
            mobile = serializer.validated_data['mobile']
            otp_code = serializer.validated_data['otp_code']
            otp_type = serializer.validated_data['otp_type']

            try:
                otp = OTP.objects.filter(
                    mobile=mobile,
                    otp_code=otp_code,
                    otp_type=otp_type,
                    is_used=False
                ).first()

                if otp and otp.verify_otp(otp_code):
                    otp.is_used = True
                    otp.save()

                    if otp_type == 'registration':
                        user = otp.user
                        user.is_active = True
                        user.save()

                        return Response({
                            'message': 'Registration completed successfully.',
                            'user': UserSerializer(user).data
                        }, status=status.HTTP_200_OK)

                    elif otp_type == 'login':
                        user = User.objects.get(mobile=mobile)
                        refresh = RefreshToken.for_user(user)

                        return Response({
                            'message': 'Login successful.',
                            'user': UserSerializer(user).data,
                            'tokens': {
                                'refresh': str(refresh),
                                'access': str(refresh.access_token),
                            }
                        }, status=status.HTTP_200_OK)

                    elif otp_type == 'password_reset':
                        return Response({
                            'message': 'OTP verified. You can now reset your password.'
                        }, status=status.HTTP_200_OK)

                return Response({
                    'error': 'Invalid or expired OTP.'
                }, status=status.HTTP_401_UNAUTHORIZED)

            except User.DoesNotExist:
                return Response({
                    'error': 'User not found.'
                }, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OTPSendView(APIView):
    """
    API view for requesting OTP.

    POST: Send OTP to mobile number.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """Send OTP to mobile number."""
        serializer = OTPSendSerializer(data=request.data)

        if serializer.is_valid():
            mobile = serializer.validated_data['mobile']
            otp_type = serializer.validated_data['otp_type']
            email = serializer.validated_data.get('email')

            try:
                if otp_type == 'registration':
                    # Check if user already exists
                    if User.objects.filter(mobile=mobile).exists():
                        return Response({
                            'error': 'User with this mobile number already exists.'
                        }, status=status.HTTP_400_BAD_REQUEST)

                    # Create inactive user
                    user = User.objects.create_user(
                        email=email,
                        mobile=mobile,
                        is_active=False
                    )

                    otp = OTP.generate_otp(
                        mobile=mobile,
                        otp_type=otp_type,
                        user=user,
                        email=email
                    )

                elif otp_type == 'login':
                    # Check if user exists
                    if not User.objects.filter(mobile=mobile).exists():
                        return Response({
                            'error': 'User with this mobile number does not exist.'
                        }, status=status.HTTP_404_NOT_FOUND)

                    user = User.objects.get(mobile=mobile)
                    otp = OTP.generate_otp(
                        mobile=mobile,
                        otp_type=otp_type,
                        user=user,
                        email=user.email
                    )

                elif otp_type == 'password_reset':
                    # Check if user exists
                    if not User.objects.filter(mobile=mobile).exists():
                        return Response({
                            'error': 'User with this mobile number does not exist.'
                        }, status=status.HTTP_404_NOT_FOUND)

                    user = User.objects.get(mobile=mobile)
                    otp = OTP.generate_otp(
                        mobile=mobile,
                        otp_type=otp_type,
                        user=user,
                        email=user.email
                    )

                send_otp(mobile, otp.otp_code)

                return Response({
                    'message': f'OTP sent successfully to {mobile}.'
                }, status=status.HTTP_200_OK)

            except Exception as e:
                return Response({
                    'error': 'Failed to send OTP. Please try again.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    API view for user login.

    POST: Login with email/mobile and password, or request OTP.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """Login user."""
        serializer = UserLoginSerializer(data=request.data)

        if serializer.is_valid():
            login_type = serializer.validated_data['login_type']

            if login_type == 'email':
                email = serializer.validated_data['email']
                password = serializer.validated_data['password']

                # Email login
                user = authenticate(email=email, password=password)

                if user:
                    if user.is_active:
                        refresh = RefreshToken.for_user(user)

                        return Response({
                            'message': 'Login successful.',
                            'user': UserSerializer(user).data,
                            'tokens': {
                                'refresh': str(refresh),
                                'access': str(refresh.access_token),
                            }
                        }, status=status.HTTP_200_OK)
                    else:
                        return Response({
                            'error': 'Account is not activated. Please verify your mobile number.'
                        }, status=status.HTTP_401_UNAUTHORIZED)
                else:
                    return Response({
                        'error': 'Invalid credentials.'
                    }, status=status.HTTP_401_UNAUTHORIZED)

            elif login_type == 'mobile':
                mobile = serializer.validated_data['mobile']
                otp_code = serializer.validated_data.get('otp_code')

                if otp_code:
                    # OTP verification for mobile login
                    try:
                        otp = OTP.objects.filter(
                            mobile=mobile,
                            otp_code=otp_code,
                            otp_type='login',
                            is_used=False
                        ).first()

                        if otp and otp.verify_otp(otp_code):
                            otp.is_used = True
                            otp.save()

                            user = otp.user
                            refresh = RefreshToken.for_user(user)

                            return Response({
                                'message': 'Login successful.',
                                'user': UserSerializer(user).data,
                                'tokens': {
                                    'refresh': str(refresh),
                                    'access': str(refresh.access_token),
                                }
                            }, status=status.HTTP_200_OK)
                        else:
                            return Response({
                                'error': 'Invalid or expired OTP.'
                            }, status=status.HTTP_401_UNAUTHORIZED)

                    except User.DoesNotExist:
                        return Response({
                            'error': 'User not found.'
                        }, status=status.HTTP_404_NOT_FOUND)
                else:
                    # Send OTP for mobile login
                    try:
                        user = User.objects.get(mobile=mobile)

                        if not user.is_active:
                            return Response({
                                'error': 'Account is not activated. Please complete registration first.'
                            }, status=status.HTTP_401_UNAUTHORIZED)

                        otp = OTP.generate_otp(
                            mobile=mobile,
                            otp_type='login',
                            user=user,
                            email=user.email
                        )
                        send_otp(mobile, otp.otp_code)

                        return Response({
                            'message': f'OTP sent to {mobile}. Please verify to complete login.',
                            'requires_otp_verification': True
                        }, status=status.HTTP_200_OK)

                    except User.DoesNotExist:
                        return Response({
                            'error': 'User with this mobile number does not exist.'
                        }, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    API view for user logout.

    POST: Logout user by blacklisting refresh token.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Logout user."""
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()

            logout(request)

            return Response({
                'message': 'Logout successful.'
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': 'Logout failed.'
            }, status=status.HTTP_400_BAD_REQUEST)


class PasswordChangeView(APIView):
    """
    API view for changing password.

    POST: Change current user's password.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Change password."""
        serializer = PasswordChangeSerializer(data=request.data, context={'user': request.user})

        if serializer.is_valid():
            user = request.user
            new_password = serializer.validated_data['new_password']

            user.set_password(new_password)
            user.save()

            return Response({
                'message': 'Password changed successfully.'
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(APIView):
    """
    API view for password reset request.

    POST: Request password reset OTP.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """Request password reset."""
        serializer = PasswordResetRequestSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            mobile = serializer.validated_data.get('mobile')

            try:
                if mobile:
                    user = User.objects.get(mobile=mobile)
                elif email:
                    user = User.objects.get(email=email)
                    mobile = user.mobile
                else:
                    return Response({
                        'error': 'Either email or mobile is required.'
                    }, status=status.HTTP_400_BAD_REQUEST)

                otp = OTP.generate_otp(
                    mobile=mobile,
                    otp_type='password_reset',
                    user=user,
                    email=user.email
                )
                send_otp(mobile, otp.otp_code)

                return Response({
                    'message': f'Password reset OTP sent to {mobile}.'
                }, status=status.HTTP_200_OK)

            except User.DoesNotExist:
                return Response({
                    'error': 'User not found.'
                }, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    """
    API view for password reset confirmation.

    POST: Reset password with OTP verification.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """Reset password with OTP verification."""
        serializer = PasswordResetConfirmSerializer(data=request.data)

        if serializer.is_valid():
            mobile = serializer.validated_data['mobile']
            otp_code = serializer.validated_data['otp_code']
            new_password = serializer.validated_data['new_password']

            try:
                user = User.objects.get(mobile=mobile)

                # Verify OTP
                otp = OTP.objects.filter(
                    mobile=mobile,
                    otp_code=otp_code,
                    otp_type='password_reset',
                    is_used=False
                ).first()

                if otp and otp.verify_otp(otp_code):
                    otp.is_used = True
                    otp.save()

                    user.set_password(new_password)
                    user.save()

                    return Response({
                        'message': 'Password reset successful.'
                    }, status=status.HTTP_200_OK)

                return Response({
                    'error': 'Invalid or expired OTP.'
                }, status=status.HTTP_401_UNAUTHORIZED)

            except User.DoesNotExist:
                return Response({
                    'error': 'User not found.'
                }, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TokenRefreshView(APIView):
    """
    API view for refreshing JWT token.

    POST: Refresh access token using refresh token.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """Refresh access token."""
        refresh_token = request.data.get('refresh_token')

        if not refresh_token:
            return Response({
                'error': 'Refresh token is required.'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            access_token = str(token.access_token)

            return Response({
                'access': access_token
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': 'Invalid or expired refresh token.'
            }, status=status.HTTP_401_UNAUTHORIZED)


class GoogleAuthView(APIView):
    """
    API view for Google OAuth authentication.

    POST: Authenticate with Google access token.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """Authenticate with Google."""
        serializer = GoogleAuthSerializer(data=request.data)

        if serializer.is_valid():
            access_token = serializer.validated_data['access_token']
            id_token = serializer.validated_data['id_token']

            # Here you would implement Google OAuth logic
            # For now, return a placeholder response
            return Response({
                'message': 'Google authentication not yet implemented.',
                'access_token': access_token,
                'id_token': id_token
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
