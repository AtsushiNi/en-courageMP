document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,dayGridDay,listMonth'
    },
    navLinks: true,
    googleCalendarApiKey: 'AIzaSyAoWJyeuPyvRs3mVv8mbxAh1zDQ3WeL-0A',
    events: 'g56gfkgj6d1adk03ofcf1kh5c0@group.calendar.google.com',
    displayEventTime: false,
    locale: "ja",
    height: window.innerHeight - 100,
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5]
    },

    eventClick: function (arg) {
      arg.jsEvent.preventDefault()
    },

    loading: function (bool) {
      document.getElementById('loading').style.display =
        bool ? 'block' : 'none';
    },
    eventDidMount: function (info) {
      const description = info.event._def.extendedProps.description
      const title = info.event._def.title
      let url = description.match(/url:.*\n/)[0]
      url = url.slice(4, -1)
      let image = description.match(/image:.*/)[0]
      image = image.slice(6)
      const path  = "./events/" + image
      const content = `
        <div style="text-align: center">
          <div>${title}</div>
          <a href="${url}" class="tooltip-img" target="_blank">
            <img src="${path}" style="width: 200px;">
          </a>
        </div>`
      tippy(".fc-event-title", {
        content: content,
        trigger: "click",
        allowHTML: true
      })
    }
  });

  calendar.render();
});
