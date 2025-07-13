let combinedData = [];

document.getElementById('excelFile').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        combinedData = [];
        const allBuildings = new Set();

        workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

            console.log(jsonData);

            jsonData.forEach(row => {
                const serviceProviderName = row["Service Provider Name"]?.toString().trim();
                const mobileNumber = row["Mobile Number"]?.toString().trim();
                const mailId = row["Email"]?.toString().trim();
                console.log(row["Start Date"]);
                const startDate = parseTextDate(row["Start Date"]);
                console.log(startDate);
                const endDate = parseTextDate(row["End Date"]);
                const serviceCategories = row["Service Categories"]?.toString().split(',').map(s => s.trim()).filter(Boolean);
                const properties = row["Properties"]?.toString().split(',').map(p => p.trim()).filter(Boolean);

                const buildingFlags = {};
                properties.forEach(p => {
                    buildingFlags[p] = 'Yes';
                    allBuildings.add(p);
                });

                // Set all others to 'No'
                allBuildings.forEach(building => {
                    if (!buildingFlags[building]) {
                        buildingFlags[building] = 'No';
                    }
                });

                combinedData.push({
                    serviceProviderName,
                    mobileNumber,
                    mailId,
                    startDate,
                    endDate,
                    serviceCategories: serviceCategories.join(', '),
                    buildingFlags
                });
            });
        });

        document.getElementById('submitBtn').disabled = combinedData.length === 0;
        showTablePreview(combinedData, allBuildings);
    };

    reader.readAsArrayBuffer(file);
});

function parseTextDate(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return '';

    const date = new Date(dateStr);
    if (isNaN(date)) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
}


function showTablePreview(data, allBuildings) {
    const container = document.getElementById('tablesContainer');
    container.innerHTML = '';

    const table = document.createElement('table');
    table.border = 1;
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headers = [
        'Provider Name', 'Mobile', 'Email', 'Start Date', 'End Date', 'Service Categories',
        ...Array.from(allBuildings)
    ];

    const tr = document.createElement('tr');
    headers.forEach(h => {
        const th = document.createElement('th');
        th.textContent = h;
        tr.appendChild(th);
    });
    thead.appendChild(tr);

    data.forEach(provider => {
        const row = document.createElement('tr');
        headers.forEach(h => {
            const td = document.createElement('td');
            if (h === 'Provider Name') td.textContent = provider.serviceProviderName;
            else if (h === 'Mobile') td.textContent = provider.mobileNumber;
            else if (h === 'Email') td.textContent = provider.mailId;
            else if (h === 'Start Date') td.textContent = parseTextDate(provider.startDate);
            else if (h === 'End Date') td.textContent = parseTextDate(provider.endDate);
            else if (h === 'Service Categories') td.textContent = provider.serviceCategories;
            else td.textContent = provider.buildingFlags[h] || 'No';
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
}

document.getElementById('submitBtn').addEventListener('click', function () {
    console.log('Submitting to API:', combinedData);

    $.ajax({
        url: WebApiUrl + '/api/Tenants/SubmitCombined',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(combinedData),
        success: () => alert('Submitted successfully!'),
        error: () => alert('Submission failed!')
    });
});