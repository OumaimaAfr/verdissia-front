// Fix for dayjs relativeTime plugin
// Create this file to properly import the plugin
import dayjs from 'dayjs';

export const relativeTime = {
  install: (dayjsInstance, option) => {
    dayjsInstance.updateLocale = function(locale, object) {
      // Implementation for relative time
      const proto = dayjsInstance.Locale;
      const localeData = proto.loadLocale(locale);
      
      if (object.relativeTime) {
        localeData.relativeTime = object.relativeTime;
      }
      
      return localeData;
    };
  }
};
