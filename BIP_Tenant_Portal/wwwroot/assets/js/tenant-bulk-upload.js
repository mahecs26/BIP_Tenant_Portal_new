let selectedPropertyType = "";
let selectedBuildingName = "";

$(document).ready(function () {
    $.ajax({
        url: WebApiUrl + '/api/Properties',
        method: 'GET',
        success: function (data) {
            var dropdown = $('#PropertyDropdown');
            $.each(data, function (index, item) {
                dropdown.append(new Option(item.propertyName, item.propertyID));
            });
        },
        error: function () {
            alert('Failed to load properties.');
        }
    });

    // Enable file input when property type is selected
    $("#FlatTypeDropdown").change(function () {
        Validate();
    });

    $("#PropertyDropdown").change(function () {
        Validate();
    });

    function Validate() {
        selectedPropertyType = $("#FlatTypeDropdown").val();
        selectedBuildingName = $("#PropertyDropdown").val();

        let isEnabled = selectedPropertyType && selectedBuildingName;

        $("#fileInput").prop("disabled", !isEnabled);
        $("button[type='submit']").prop("disabled", !isEnabled);
    }


    $("#uploadForm").submit(function (e) {
        e.preventDefault();
        $("#loadingSpinner").show();
        var file = $("#fileInput")[0].files[0];

        if (file) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var data = event.target.result;
                var workbook = XLSX.read(data, { type: 'binary' });

                var sheet = workbook.Sheets[workbook.SheetNames[0]];
                var jsonData = XLSX.utils.sheet_to_json(sheet);

                let previewHtml = '';
                let headersHtml = '';

                if (selectedPropertyType === "Commercial") {

                    headersHtml = `
                                <th>Sr No</th>
                                <th>Building Code</th>
                                <th>Floor</th>
                                <th>Flat No</th>
                                <th style="width:280px;">Occupants</th>
                                <th>No of Rooms</th>
                                <th style="width:280px;">Tenant Name</th>
                                <th>Contact No. / Employee No.</th>
                            `;

                    jsonData.forEach(function (row, index) {
                        previewHtml += `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${row['Building Code'] || ''}</td>
                                        <td>${row['Floor'] || ''}</td>
                                        <td>${row['Flat No'] || ''}</td>
                                        <td>${row['Occupants'] || ''}</td>
                                        <td>${row['No of Rooms'] || ''}</td>
                                        <td>${row['Tenant Name'] || ''}</td>
                                        <td>${row['Contact no. / Employee No.'] || ''}</td>
                                    </tr>
                                `;
                    });


                } else if (selectedPropertyType === "Residential") {
                    headersHtml = `
                                <th>Sr No</th>
                                <th>Building Code</th>
                                <th>Floor</th>
                                <th>Flat No</th>
                                <th style="width:280px;">Occupants</th>
                                <th>No of Rooms</th>
                                <th style="width:280px;">Tenant Name</th>
                                <th>Contact No. / Employee No.</th>
                            `;

                    jsonData.forEach(function (row, index) {
                        previewHtml += `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${row['Building Code'] || ''}</td>
                                        <td>${row['Floor'] || ''}</td>
                                        <td>${row['Flat No'] || ''}</td>
                                        <td>${row['Occupants'] || ''}</td>
                                        <td>${row['No of Rooms'] || ''}</td>
                                        <td>${row['Tenant Name'] || ''}</td>
                                        <td>${row['Contact no. / Employee No.'] || ''}</td>
                                    </tr>
                                `;
                    });
                }
                else {
                    headersHtml = `
                                <th>Sr No</th>
                                <th>Building Code</th>
                                <th>Floor</th>
                                <th>Flat No</th>
                                <th style="width:280px;">Occupants</th>
                                <th>No of Rooms</th>
                                <th style="width:280px;">Tenant Name</th>
                                <th>Contact No. / Employee No.</th>
                            `;

                    jsonData.forEach(function (row, index) {
                        previewHtml += `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${row['Building Code'] || ''}</td>
                                        <td>${row['Floor'] || ''}</td>
                                        <td>${row['Flat No'] || ''}</td>
                                        <td>${row['Occupants'] || ''}</td>
                                        <td>${row['No of Rooms'] || ''}</td>
                                        <td>${row['Tenant Name'] || ''}</td>
                                        <td>${row['Contact no. / Employee No.'] || ''}</td>
                                    </tr>
                                `;
                    });
                }

                $("#tableHeaders").html(headersHtml);
                $("#dataPreview tbody").html(previewHtml);
                $("#loadingSpinner").hide();
                $("#previewTable").fadeIn();
            };

            reader.readAsBinaryString(file);
        }
    });

    $("#saveData").click(function () {
        var tenants = [];
        var hasEmptyBuildingCode = false;

        $("#dataPreview tbody tr").each(function () {
            var row = $(this);
            if (selectedPropertyType === "Commercial") {
                //tenants.push({
                //    Property: row.find('td').eq(1).text(),
                //    ShopNo: row.find('td').eq(2).text(),
                //    TenantName: row.find('td').eq(3).text(),
                //    ContactNo: row.find('td').eq(4).text()
                //});

                var buildingCode = row.find('td').eq(1).text().trim();

                if (!buildingCode) {
                    alert('Building Code is empty for one or more rows.');
                    hasEmptyBuildingCode = true;
                    return false; // Exit the .each() loop
                }

                tenants.push({
                    BuildingCode: buildingCode,
                    Floor: row.find('td').eq(2).text(),
                    FlatNo: row.find('td').eq(3).text(),
                    Occupants: row.find('td').eq(4).text(),
                    NoOfRooms: row.find('td').eq(5).text(),
                    TenantName: row.find('td').eq(6).text(),
                    ContactNo: row.find('td').eq(7).text().replace(/\s+/g, '')
                });

            } else if (selectedPropertyType === "Residential") {

                var buildingCode = row.find('td').eq(1).text().trim();

                if (!buildingCode) {
                    alert('Building Code is empty for one or more rows.');
                    hasEmptyBuildingCode = true;
                    return false; // Exit the .each() loop
                }

                tenants.push({
                    BuildingCode: buildingCode,
                    Floor: row.find('td').eq(2).text(),
                    FlatNo: row.find('td').eq(3).text(),
                    Occupants: row.find('td').eq(4).text(),
                    NoOfRooms: row.find('td').eq(5).text(),
                    TenantName: row.find('td').eq(6).text(),
                    ContactNo: row.find('td').eq(7).text()
                });
            }
            else {
                var buildingCode = row.find('td').eq(1).text().trim();

                if (!buildingCode) {
                    alert('Building Code is empty for one or more rows.');
                    hasEmptyBuildingCode = true;
                    return false; // Exit the .each() loop
                }

                tenants.push({
                    BuildingCode: buildingCode,
                    Floor: row.find('td').eq(2).text(),
                    FlatNo: row.find('td').eq(3).text(),
                    Occupants: row.find('td').eq(4).text(),
                    NoOfRooms: row.find('td').eq(5).text(),
                    TenantName: row.find('td').eq(6).text(),
                    ContactNo: row.find('td').eq(7).text()
                });
            }
        });

        if (hasEmptyBuildingCode) {
            return false; // Exit the click function
        }

        if (selectedPropertyType === "Commercial") {
            var requestData = {
                PropertyId: $("#PropertyDropdown").val(),
                PropertyType: $("#FlatTypeDropdown").val(),
                Tenants: tenants
            };

            $.ajax({
                url: WebApiUrl + "/api/tenants/add-tenants",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(requestData),
                success: function (response) {
                    alert('Data saved successfully!');
                    $("#previewTable").fadeOut();
                },
                error: function (xhr) {
                    alert("Error: " + xhr.responseText);
                }
            });

        } else if (selectedPropertyType === "Residential") {
            var requestData = {
                PropertyId: $("#PropertyDropdown").val(),
                PropertyType: $("#FlatTypeDropdown").val(),
                Tenants: tenants
            };

            $.ajax({
                url: WebApiUrl + "/api/tenants/add-tenants",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(requestData),
                success: function (response) {
                    alert('Data saved successfully!');
                    $("#previewTable").fadeOut();
                },
                error: function (xhr) {
                    alert("Error: " + xhr.responseText);
                }
            });
        }
        else {
            var requestData = {
                PropertyId: $("#PropertyDropdown").val(),
                PropertyType: $("#FlatTypeDropdown").val(),
                Tenants: tenants
            };

            $.ajax({
                url: WebApiUrl + "/api/tenants/add-tenants",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(requestData),
                success: function (response) {
                    alert('Data saved successfully!');
                    $("#previewTable").fadeOut();
                },
                error: function (xhr) {
                    alert("Error: " + xhr.responseText);
                }
            });
        }
    });
});