$(document).ready(function () {

    console.log("GetPropertyDetailsForUserByFlatId - > " + WebApiUrl + "/api/Users/GetPropertyDetailsForUserByFlatId/" + FlatID);

    $.ajax({
        type: "GET",
        url: WebApiUrl + "/api/Users/GetPropertyDetailsForUserByFlatId/" + FlatID,
        success: function (data) {
            console.log(data);
            $('#BuildingName').val(data.propertyName);
            $('#BuildingCode').val(data.buildingCode);
            $('#FlatNumber').val(data.flatNumber);
        }
    });

    let serviceCategories = [];

    $.ajax({
        url: WebApiUrl + '/api/ServiceMainCategory',
        method: 'GET',
        success: function (data) {
            console.log(data);
            serviceCategories = data;
            var dropdown = $('#serviceCategory1');
            $.each(data, function (index, item) {
                dropdown.append(new Option(item.mainCategoryName, item.mainCategoryID));
            });
        },
        error: function () {
            alert('Failed to load category dropdown.');
        }
    });



    let categoryCount = 1;

    function createDropdownOptions(options) {
        console.log(options);
        return options.map(option => `
            <option value="${option.mainCategoryID}" title="${option.mainCategoryName}">
                ${option.mainCategoryName}
            </option>
        `).join('');
    }

    $('#addCategory').click(function () {
        categoryCount++;

        // Collapse all currently open categories
        $('#accordion .collapse.show').collapse('hide');

        // Create a new category
        const newCategory = `
                <div class="card mb-1 shadow-none">
                    <a href="#collapse${categoryCount}" class="text-dark" data-toggle="collapse" aria-expanded="true" aria-controls="collapse${categoryCount}">
                        <div class="card-header" id="heading${categoryCount}">
                            <h6 class="m-0">
                                Service Request #${categoryCount}
                                <i class="mdi mdi-chevron-up float-right accor-down-icon"></i>
                            </h6>
                        </div>
                    </a>
                    <div id="collapse${categoryCount}" class="collapse" aria-labelledby="heading${categoryCount}" data-parent="#accordion">
                        <div class="card-body row">
                            <div class="col-md-3 mb-3">
                                <label for="serviceCategory${categoryCount}" class="form-label">Service Category</label>
                                <select class="form-control" id="serviceCategory${categoryCount}" onchange="loadSubCategories(this)">
                                    <option selected>Choose...</option>
                                    ${createDropdownOptions(serviceCategories)}
                                </select>
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="subCategory${categoryCount}">Sub Category</label>
                                <select class="form-control subCategory" id="subCategory${categoryCount}" name="SubCategoryID${categoryCount}" required>
                                    <option value="">-- Select Sub Category --</option>
                                </select>
                                <div class="invalid-feedback">
                                    Please select a Sub Category.
                                </div>
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="visitTime${categoryCount}" class="form-label datetime-restrict">Prefered Visit Date</label>
                                <input type="text" class="form-control datetime-restrict" placeholder="'yyy-mm-dd" id="preferedVisitTime${categoryCount}">
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="visitTime${categoryCount}" class="form-label datetime-restrict">Prefered Visit Time</label>
                                <select id="time${categoryCount}" class="form-control timedropdwon">
                                ${timeOptions}
                                </select>
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="communicationMethod${categoryCount}" class="form-label">Communication Method</label>
                                <select class="form-control" id="communicationMethod${categoryCount}">
                                    <option selected>Choose...</option>
                                    <option>Phone</option>
                                    <option>Email</option>
                                </select>
                            </div>
                            <div class="col-md-12 mb-3">
                                <label for="upload${categoryCount}" class="form-label">Upload Photos</label>
                                <input type="file" class="form-control" id="upload${categoryCount}" accept=".jpg, .png, .jpeg">
                            </div>
                            <div class="col-md-12 mb-3">
                                <label for="description${categoryCount}" class="form-label">Description</label>
                                <textarea class="form-control" id="description${categoryCount}" rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                </div>`;

        // Append the new category to the accordion
        $('#accordion').append(newCategory);

        $(".datetime-restrict").datepicker({
            dateFormat: 'yy-mm-dd',
            minDate: 0,
            onSelect: function (dateText) {
                filterTimeSlots(dateText);
            }
        });

        function filterTimeSlots(selectedDate) {
            const now = new Date();
            const selected = new Date(selectedDate);
            const isToday = selected.toDateString() === now.toDateString();
            const timeDropdown = $('.timedropdwon');
            timeDropdown.empty();

            // Re-generate filtered options
            for (var hour = 9; hour <= 18; hour++) {
                for (var minute = 0; minute < 60; minute += 30) {
                    if (hour === 18 && minute === 30) break;

                    var dateTimeOption = new Date(selectedDate);
                    dateTimeOption.setHours(hour, minute, 0, 0);

                    if (isToday && dateTimeOption <= now) {
                        continue; // Skip past times for today
                    }

                    var hour12 = hour > 12 ? hour - 12 : hour;
                    var ampm = hour >= 12 ? 'PM' : 'AM';
                    var time = (hour12 < 10 ? '0' : '') + hour12 + ':' + (minute === 0 ? '00' : '30') + ' ' + ampm;
                    timeDropdown.append('<option value="' + time + '">' + time + '</option>');
                }
            }
        }

        // Expand the new category
        setTimeout(() => {
            $(`#collapse${categoryCount}`).collapse('show');
        }, 500);


    });

    function submitTenantData() {
        // Prepare FormData
        const formData = new FormData();

        // Dynamically build tenantQuery array
        for (let i = 1; i <= categoryCount; i++) {
            let query = {
                serviceCategory: $(`#subCategory${i}`).val(),
                visitTime: $(`#preferedVisitTime${i}`).val() + ' ' + $(`#time${i}`).val(),
                communicationMethod: $(`#communicationMethod${i}`).val(),
                description: $(`#description${i}`).val(),
                upload: $(`#upload${i}`)[0]?.files[0] // Handle file upload if it exists
            };

            //var visitTimeId = $(`#visitTime${i}`).val();    

            //if (visitTimeId != '' && isValidDate(visitTimeId)) {
            //    if (isDateLessThanToday(visitTimeId)) {
            //        alert('Visit time cannot be past date on the service request ' + i);
            //        return false;
            //    }
            //}
            //else {
            //    alert('Visit time is invalid on the category service request ' + i);
            //    return false;
            //}
            // Add the category data to FormData if a valid service category is selected
            if (query.serviceCategory && query.serviceCategory !== 'Choose...') {
                formData.append(`tenantQuery[${i - 1}].ServiceCategory`, query.serviceCategory);
                formData.append(`tenantQuery[${i - 1}].VisitTime`, query.visitTime);
                formData.append(`tenantQuery[${i - 1}].CommunicationMethod`, query.communicationMethod);
                formData.append(`tenantQuery[${i - 1}].Description`, query.description);

                // Add file if it's provided
                if (query.upload) {
                    formData.append(`tenantQuery[${i - 1}].Upload`, query.upload);
                }
            }
        }

        // Make the AJAX call
        $.ajax({
            url: PortalBaseUrl + '/UserServiceRequest/CreateOK', // Replace with your actual controller route
            type: 'POST',
            contentType: false, // Required for FormData
            processData: false, // Required for FormData
            data: formData,
            success: function (response) {
                console.log('Data submitted successfully:', response);
                window.location = PortalBaseUrl + "/UserServiceRequest/ServiceRequestList";
            },
            error: function (xhr, status, error) {
                console.error('Error occurred:', error);
                console.error(xhr);
                console.error(status);
            }
        });
    }

    // Example usage: Trigger the function on a button click
    $('#submitForm').on('click', function () {
        submitTenantData();
    });
});
function isValidDate(dateString) {
    var date = new Date(dateString);
    return !isNaN(date.getTime());
}
function isValidDateFormat(dateString) {
    var datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return datePattern.test(dateString);
}

function isDateLessThanToday(inputDate) {
    var today = new Date();
    var comparisonDate = new Date(inputDate);

    today.setHours(0, 0, 0, 0);
    comparisonDate.setHours(0, 0, 0, 0);

    return comparisonDate < today;
}
function loadSubCategories(selectElement) {
    var mainCategoryId = $(selectElement).val();

    // Find the nearest parent .col-md-3 and get the next .col-md-3 for the subcategory
    var subCategory = $(selectElement)
        .closest('.col-md-3')
        .next('.col-md-3')
        .find('.subCategory');

    // Clear and show loading message
    subCategory.empty().append('<option value="">-- Loading... --</option>');

    if (mainCategoryId) {
        $.ajax({
            url: WebApiUrl + '/api/ServiceCategories/GetSubCategories',
            type: 'GET',
            data: { mainCategoryId: mainCategoryId },
            success: function (data) {
                subCategory.empty().append('<option value="">-- Select Sub Category --</option>');
                $.each(data, function (index, item) {
                    subCategory.append(
                        $('<option>', {
                            value: item.value,
                            text: item.text
                        })
                    );
                });
            },
            error: function () {
                subCategory.empty().append('<option value="">-- Error loading subcategories --</option>');
            }
        });
    } else {
        subCategory.empty().append('<option value="">-- Select Sub Category --</option>');
    }
}
