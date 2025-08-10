const cron = require('node-cron');
const GlobalSlotTemplate = require('../models/globalSlotTemplate.model');
const SlotTemplate = require('../models/predefine.model');

class CronService {
  constructor() {
    this.isRunning = false;
  }

  // Start the cron service
  start() {
    if (this.isRunning) {
      console.log('Cron service is already running');
      return;
    }

    // Run every day at 12:01 AM
    cron.schedule('1 0 * * *', async () => {
      console.log('🕐 Running daily slot generation cron job...');
      await this.generateDailySlots();
    }, {
      scheduled: true,
      timezone: "Asia/Kolkata" // Indian timezone
    });

    // Also run immediately when service starts
    this.generateDailySlots();

    this.isRunning = true;
    console.log('✅ Cron service started - will generate slots daily at 12:01 AM');
  }

  // Stop the cron service
  stop() {
    if (!this.isRunning) {
      console.log('Cron service is not running');
      return;
    }

    cron.getTasks().forEach(task => task.stop());
    this.isRunning = false;
    console.log('⏹️ Cron service stopped');
  }

  // Generate slots for the next 10 days
  async generateDailySlots() {
    try {
      // Get the global template
      const globalTemplate = await GlobalSlotTemplate.findOne({ isActive: true });
      
      if (!globalTemplate || !globalTemplate.slots || globalTemplate.slots.length === 0) {
        console.log('⚠️ No global slot template found. Skipping daily generation.');
        return;
      }

      const dates = [];
      const today = new Date();

      // Generate dates for next 10 days
      for (let i = 0; i < 10; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dates.push(d.toISOString().split("T")[0]);
      }

      let createdCount = 0;
      let updatedCount = 0;

      // Create or update templates for each date
      for (const date of dates) {
        const existingTemplate = await SlotTemplate.findOne({ date });
        
        if (existingTemplate) {
          // Update existing template with latest global slots
          await SlotTemplate.updateOne(
            { date },
            { 
              $set: { 
                slots: globalTemplate.slots,
                isDateClosed: false 
              } 
            }
          );
          updatedCount++;
        } else {
          // Create new template
          await SlotTemplate.create({
            date,
            slots: globalTemplate.slots,
            isDateClosed: false
          });
          createdCount++;
        }
      }

      console.log(`✅ Daily slot generation completed: ${createdCount} created, ${updatedCount} updated`);
      
    } catch (error) {
      console.error('❌ Error in daily slot generation:', error);
    }
  }

  // Manual trigger for slot generation
  async generateSlotsManually(days = 10, startDate = null) {
    try {
      const globalTemplate = await GlobalSlotTemplate.findOne({ isActive: true });
      
      if (!globalTemplate || !globalTemplate.slots || globalTemplate.slots.length === 0) {
        throw new Error('No global slot template found');
      }

      const dates = [];
      const start = startDate ? new Date(startDate) : new Date();

      for (let i = 0; i < days; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        dates.push(d.toISOString().split("T")[0]);
      }

      let createdCount = 0;
      let updatedCount = 0;

      for (const date of dates) {
        const existingTemplate = await SlotTemplate.findOne({ date });
        
        if (existingTemplate) {
          await SlotTemplate.updateOne(
            { date },
            { 
              $set: { 
                slots: globalTemplate.slots,
                isDateClosed: false 
              } 
            }
          );
          updatedCount++;
        } else {
          await SlotTemplate.create({
            date,
            slots: globalTemplate.slots,
            isDateClosed: false
          });
          createdCount++;
        }
      }

      return {
        success: true,
        message: `Generated slots for ${days} days`,
        created: createdCount,
        updated: updatedCount,
        total: dates.length,
        dates
      };
      
    } catch (error) {
      console.error('Error in manual slot generation:', error);
      throw error;
    }
  }
}

module.exports = new CronService();

