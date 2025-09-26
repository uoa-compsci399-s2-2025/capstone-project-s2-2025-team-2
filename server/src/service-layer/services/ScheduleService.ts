import cron from 'node-cron';
import { ExpiryController } from '../../presentation-layer/controllers/ExpiryController';

export class ScheduleService {
     /**
      * Schedules the sending of expiry notification emails to users every day at 9 AM.
      */
     public scheduleExpiryEmails(): void {
          cron.schedule('0 9 * * *', async () => {
               try {
                    await new ExpiryController().sendExpiryNotifications();
                    console.log('Expiry notification emails sent successfully.');
               } catch (error) {
                    console.error('Error sending expiry notification emails:', error);
                    throw new Error('Failed to send expiry notification emails');
               }
          });
             console.log('Scheduler started - expiry notifications will run daily at 9:00 AM');
 
     }
}