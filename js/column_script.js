document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, 
    {

      locale:'ja',

      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,listYear'
      },

      displayEventTime: false, // don't show the time column in list view

      // THIS KEY WON'T WORK IN PRODUCTION!!!
      // To make your own Google API key, follow the directions here:
      // http://fullcalendar.io/docs/google_calendar/
      googleCalendarApiKey: 'AIzaSyBHTm42ctqQ8Cqcz-kCX85NE4F1tN2NGAM',

      // US Holidays
      // events: 't.oya-kyoto10-232@en-courage.net',
      eventSources: [
        // {
        //   googleCalendarId: 'ja.japanese#holiday@group.v.calendar.google.com',
        //   className: 'event_holiday'
        // },
        {
          googleCalendarId: 't.oya-kyoto10-232@en-courage.net',
        }
      ],

      eventClick: function(arg) {
        // opens events in a popup window
        window.open(arg.event.url, 'google-calendar-event', 'width=700,height=600');

        arg.jsEvent.preventDefault() // don't navigate in main tab
      },

      loading: function(bool) {
        document.getElementById('loading').style.display =
          bool ? 'block' : 'none';
      }

    });

    calendar.render();
});