import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Toast } from '@capacitor/toast';

export const isNative = () => Capacitor.isNativePlatform();

export const triggerHapticImpact = async (style: 'light' | 'medium' | 'heavy' = 'medium') => {
  if (!isNative()) return;
  try {
    let capStyle = ImpactStyle.Medium;
    if (style === 'light') capStyle = ImpactStyle.Light;
    if (style === 'heavy') capStyle = ImpactStyle.Heavy;
    await Haptics.impact({ style: capStyle });
  } catch (e) {
    console.error('Haptic impact failed', e);
  }
};

export const triggerHapticNotification = async (type: 'success' | 'warning' | 'error') => {
  if (!isNative()) return;
  try {
    let capType = NotificationType.Success;
    if (type === 'warning') capType = NotificationType.Warning;
    if (type === 'error') capType = NotificationType.Error;
    await Haptics.notification({ type: capType });
  } catch (e) {
    console.error('Haptic notification failed', e);
  }
};

export const showNativeToast = async (text: string) => {
  if (isNative()) {
    try {
      await Toast.show({ text, duration: 'short' });
      return;
    } catch (e) {
      console.error('Native toast failed', e);
    }
  }
};

export const getCurrentLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
  try {
    if (isNative()) {
      const permission = await Geolocation.checkPermissions();
      if (permission.location !== 'granted') {
        const req = await Geolocation.requestPermissions();
        if (req.location !== 'granted') {
          return null;
        }
      }
      const coordinates = await Geolocation.getCurrentPosition();
      return {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
      };
    }
  } catch (e) {
    console.error('Native Geolocation failed', e);
  }
  
  // Non-native fallback
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        resolve(null);
      }
    );
  });
};

export const takeProductPhoto = async (): Promise<string | null> => {
  try {
    const permission = await Camera.checkPermissions();
    if (permission.camera !== 'granted') {
      const req = await Camera.requestPermissions();
      if (req.camera !== 'granted') {
        return null;
      }
    }
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });
    return image.base64String ? `data:image/jpeg;base64,${image.base64String}` : null;
  } catch (e) {
    console.error('Native Camera failed', e);
    return null;
  }
};
