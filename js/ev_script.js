document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    googleCalendarApiKey: 'AIzaSyAoWJyeuPyvRs3mVv8mbxAh1zDQ3WeL-0A',
    events: 'g56gfkgj6d1adk03ofcf1kh5c0@group.calendar.google.com',

    eventClick: function (arg) {
      window.open(arg.event.url, 'google-calendar-event', 'width=700,height=600');
      arg.jsEvent.preventDefault()
    },

    loading: function (bool) {
      document.getElementById('loading').style.display =
        bool ? 'block' : 'none';
    }
  });

  calendar.render();
});
