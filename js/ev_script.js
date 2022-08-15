document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
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
      let url = description.match(/url:.*/)[0]
      url = url.match(/https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+/g)[0]
      let image = description.match(/image:[\w\/\.]+/)[0]
      image = image.slice(6)
      image = "../images/events/" + image

      const tooltip = $("#tooltip").clone(true, true)
      tooltip.find("img").attr("src", image)
      tooltip.find(".title").html(title)
      tooltip.find(".background").attr("href", url)

      $(info.el).parent().append(tooltip)
    }
  });

  calendar.render();
});

let isEventHover = false
let isTooltipHover = false
let width = 0
$(document).on({
  "mouseenter": function() {
    $(this).next().css("display", "")
    width = $(this).width()
    $(this).next().css("left", "calc("+width/2+"px - 140px)")
    isEventHover = true
  },
  "mouseleave": function() {
    if(!isTooltipHover) {
      $(this).next().css("display", "none")
    }
    isEventHover = false
  }
}, ".fc-event")
$(document).on({
  "mouseenter": function() {
    $(this).css("display", "")
    isTooltipHover = true
  },
  "mouseleave": function() {
    if(!isEventHover) {
      $(this).css("display", "none")
    }
    isTooltipHover = false
  }
}, "#tooltip")
