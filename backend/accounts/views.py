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
                otp = OTP.objects.get(
                    mobile=mobile,
                    otp_code=otp_code,
                    otp_type=otp_type,
                    is_used=False
                )
                
                if otp.verify_otp(otp_code):
                    otp.is_used = True
                    otp.save()
                    
                    # Update user's mobile_verified status
                    if otp.user:
                        otp.user.mobile_verified = True
                        otp.user.save()
                    
                    # Generate tokens for login after registration
                    if otp_type == 'registration':
                        refresh = RefreshToken.for_user(otp.user)
                        return Response({
                            'message': 'OTP verified successfully.',
                            'user': UserSerializer(otp.user).data,
                            'tokens': {
                                'refresh': str(refresh),
                                'access': str(refresh.access_token),
                            }
                        }, status=status.HTTP_200_OK)
                    
                    return Response({
                        'message': 'OTP verified successfully.'
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        'error': 'OTP is invalid or expired.'
                    }, status=status.HTTP_400_BAD_REQUEST)
                    
            except OTP.DoesNotExist:
                return Response({
                    'error': 'Invalid OTP.'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OTPSendView(APIView):
    """
    API view for requesting OTP.
    
    POST: Send a new OTP to the mobile number.
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Send a new OTP to the mobile number."""
        serializer = OTPSendSerializer(data=request.data)
        
        if serializer.is_valid():
            mobile = serializer.validated_data['mobile']
            otp_type = serializer.validated_data.get('otp_type', 'login')
            email = serializer.validated_data.get('email')
            
            # Check if user exists for login OTP
            if otp_type == 'login':
                try:
                    user = User.objects.get(mobile=mobile)
                except User.DoesNotExist:
                    return Response({
                        'error': 'User with this mobile number does not exist.'
                    }, status=status.HTTP_404_NOT_FOUND)
            
            # Generate and send OTP
            otp = OTP.generate_otp(
                mobile=mobile,
                otp_type=otp_type,
                email=email
            )
            send_otp(mobile, otp.otp_code)
            
            return Response({
                'message': 'OTP sent successfully.',
                'expires_in_minutes': 10
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    API view for user login.
    
    POST: Login with email/password, mobile/OTP, or Google OAuth.
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Authenticate user and return tokens."""
        serializer = UserLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            login_type = serializer.validated_data['login_type']
            
            if login_type == 'email':
                return self._email_login(request)
            elif login_type == 'mobile':
                return self._mobile_login(request)
            elif login_type == 'google':
                return self._google_login(request)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def _email_login(self, request):
        """Handle email/password login."""
        email = request.data.get('email').lower()
        password = request.data.get('password')
        
        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            login(request, user)
            user.last_login = timezone.now()
            user.save()
            
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Login successful.',
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
        
        return Response({
            'error': 'Invalid email or password.'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    def _mobile_login(self, request):
        """Handle mobile/OTP login."""
        mobile = request.data.get('mobile')
        otp_code = request.data.get('otp_code')
        
        try:
            user = User.objects.get(mobile=mobile)
            
            # Verify OTP
            otp = OTP.objects.filter(
                mobile=mobile,
                otp_code=otp_code,
                otp_type='login',
                is_used=False
            ).first()
            
            if otp and otp.verify_otp(otp_code):
                otp.is_used = True
                otp.save()
                
                login(request, user)
                user.last_login = timezone.now()
                user.save()
                
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'message': 'Login successful.',
                    'user': UserSerializer(user).data,
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                }, status=status.HTTP_200_OK)
            
            return Response({
                'error': 'Invalid or expired OTP.'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
        except User.DoesNotExist:
            return Response({
                'error': 'User with this mobile number does not exist.'
            }, status=status.HTTP_404_NOT_FOUND)
    
    def _google_login(self, request):
        """Handle Google OAuth login."""
        # Google OAuth is handled by social-auth
        return Response({
            'error': 'Google login should be done via the social auth endpoint.'
        }, status=status.HTTP_400_BAD_REQUEST)


class GoogleAuthView(APIView):
    """
    API view for Google OAuth authentication.
    
    POST: Authenticate user with Google OAuth access token.
    GET: Initiate Google OAuth flow (redirect to Google).
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Redirect to Google OAuth consent page."""
        from django.conf import settings
        from social_django.utils import load_strategy
        from urllib.parse import urlencode
        
        backend = load_strategy().get_backend('google-oauth2')
        
        auth_url = backend.auth_url(
            settings.SOCIAL_AUTH_GOOGLE_OAUTH2_REDIRECT_URI,
            load_strategy()
        )
        
        return Response({
            'auth_url': auth_url
        }, status=status.HTTP_200_OK)
    
    @psa('google-oauth2')
    def post(self, request):
        """Authenticate user with Google OAuth."""
        serializer = GoogleAuthSerializer(data=request.data)
        
        if serializer.is_valid():
            access_token = serializer.validated_data['access_token']
            
            # Use social-auth to authenticate with the access token
            user = request.backend.do_auth(access_token)
            
            if user:
                login(request, user)
                user.last_login = timezone.now()
                user.save()
                
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'message': 'Google login successful.',
                    'user': UserSerializer(user).data,
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                }, status=status.HTTP_200_OK)
            
            return Response({
                'error': 'Google authentication failed.'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    API view for user logout.
    
    POST: Logout user and blacklist refresh token.
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Logout user and blacklist refresh token."""
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            logout(request)
            
            return Response({
                'message': 'Logged out successfully.'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logout(request)
            return Response({
                'message': 'Logged out successfully.'
            }, status=status.HTTP_200_OK)


class ProfileView(APIView):
    """
    API view for user profile.
    
    GET: Get current user's profile.
    PUT/PATCH: Update current user's profile.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get current user's profile with their job applications."""
        user = request.user
        
        # Get user's job applications
        applications = JobApplication.objects.filter(applicant=user)
        
        # Serialize data
        user_serializer = UserSerializer(user)
        applications_serializer = JobApplicationSummarySerializer(applications, many=True)
        
        # Combine data
        response_data = {
            'user': user_serializer.data,
            'applications': applications_serializer.data
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
    
    def put(self, request):
        """Update current user's profile."""
        serializer = UserUpdateSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Profile updated successfully.',
                'user': UserSerializer(request.user).data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordChangeView(APIView):
    """
    API view for changing password.
    
    POST: Change user's password.
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Change user's password."""
        serializer = PasswordChangeSerializer(
            data=request.data,
            context={'user': request.user}
        )
        
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response({
                'message': 'Password changed successfully.'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(APIView):
    """
    API view for password reset request.
    
    POST: Request password reset via mobile OTP.
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Request password reset."""
        serializer = PasswordResetRequestSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            mobile = serializer.validated_data['mobile']
            
            try:
                user = User.objects.get(email=email, mobile=mobile)
                
                # Generate OTP
                otp = OTP.generate_otp(
                    mobile=mobile,
                    otp_type='password_reset',
                    user=user
                )
                send_otp(mobile, otp.otp_code)
                
                return Response({
                    'message': 'OTP sent to your mobile number.',
                    'mobile': mobile[:4] + '****' + mobile[-4:]
                }, status=status.HTTP_200_OK)
                
            except User.DoesNotExist:
                return Response({
                    'error': 'No user found with this email and mobile number.'
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

