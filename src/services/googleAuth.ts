// Google OAuth Service
declare global {
  interface Window {
    google: any;
  }
}

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

class GoogleAuthService {
  private clientId = 'YOUR_GOOGLE_CLIENT_ID'; // You'll need to replace this with your actual Google Client ID
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      // Load Google Identity Services script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.isInitialized = true;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async signIn(): Promise<GoogleUser | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      try {
        window.google.accounts.id.initialize({
          client_id: this.clientId,
          callback: (response: any) => {
            if (response.credential) {
              const decoded = this.decodeJwtResponse(response.credential);
              resolve(decoded);
            } else {
              resolve(null);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            reject(new Error('Google Sign-In was not displayed or was skipped'));
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  signOut(): void {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }
  }

  private decodeJwtResponse(token: string): GoogleUser {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  // For development/demo purposes, you can use this method to simulate Google login
  async signInDemo(): Promise<GoogleUser> {
    // Simulate a delay like real authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: 'demo-google-user-123',
      email: 'demo.bricklayer@gmail.com',
      name: 'Demo Bricklayer',
      picture: 'https://via.placeholder.com/150',
      given_name: 'Demo',
      family_name: 'Bricklayer'
    };
  }
}

export const googleAuthService = new GoogleAuthService(); 