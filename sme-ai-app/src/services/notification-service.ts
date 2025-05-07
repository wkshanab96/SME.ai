type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  onClick?: () => void;
}

class NotificationService {
  private static instance: NotificationService;
  private _isEnabled: boolean = false;

  private constructor() {
    // Check if browser supports notifications
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this._isEnabled = Notification.permission === 'granted';
    }
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Request permission to show notifications
   */
  public async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this._isEnabled = permission === 'granted';
      return this._isEnabled;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Check if notifications are enabled
   */
  public get isEnabled(): boolean {
    return this._isEnabled;
  }

  /**
   * Show a notification
   */
  public async showNotification(options: NotificationOptions): Promise<boolean> {
    if (!this._isEnabled) {
      return false;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        tag: options.tag
      });

      if (options.onClick) {
        notification.onclick = options.onClick;
      }

      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      return false;
    }
  }

  /**
   * Send a test notification
   */
  public async sendTestNotification(): Promise<boolean> {
    return this.showNotification({
      title: 'SME.AI Notifications',
      body: 'Notifications are now enabled for SME.AI',
    });
  }
}

export default NotificationService.getInstance();