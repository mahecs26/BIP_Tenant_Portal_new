$(document).ready(function () {
    var events = holidays.map(function (holiday) {
        return {
            title: holiday.holidayName,
            holidayType: holiday.holidayType,  // Add holidayType for custom rendering
            start: holiday.holidayDate,  // FullCalendar accepts ISO 8601 date format
            allDay: true,  // Treat the holiday as an all-day event
            description: holiday.holidayType
        };
    });

    // Initialize FullCalendar
    $('#calendar').fullCalendar({
        events: events,  // Use the events array populated with holiday data
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        eventRender: function (event, element) {
            var customTitle = event.holidayType + "<br>" + event.title;
            element.find('.fc-title').html(customTitle);
        }
    });
});