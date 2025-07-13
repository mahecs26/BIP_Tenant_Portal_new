
let availablePermissions = []; // Global variable to store available permissions
function buildTree(permissions, parentId) {
    let treeHtml = '<ul>';
    const filteredPermissions = permissions.filter(p => p.parentMenuId === parentId);

    filteredPermissions.forEach(menu => {
        let checkboxId = 'permission_' + menu.id;
        let hasChildren = permissions.some(p => p.parentMenuId === menu.id);
        let isChecked = availablePermissions.some(p => p.pageId === menu.id) ? 'checked' : '';  // Check if the permission should be selected

        treeHtml += '<li>';

        // Parent checkbox (main category)
        if (hasChildren) {
            treeHtml += `<input type="checkbox" class="icheckbox parent-checkbox" id="${checkboxId}" name="Permissions" value="${menu.id}" ${isChecked}>`;
        } else {
            // Child checkboxes
            treeHtml += `<input type="checkbox" class="icheckbox child-checkbox" data-parent-id="permission_${menu.parentMenuId}" id="${checkboxId}" name="Permissions" value="${menu.id}" ${isChecked}>`;
        }

        treeHtml += `<label for="${checkboxId}"> ${menu.pageName}</label>`;

        // Recursively add child items
        treeHtml += buildTree(permissions, menu.id);
        treeHtml += '</li>';
    });

    treeHtml += '</ul>';
    return treeHtml;
}

$(document).ready(function () {

    $('#saveUserBtn').click(function () {
        let selectedPermissions = [];
        $(".checked > input[type='checkbox']").each(function () {
            selectedPermissions.push(parseInt($(this).val()));
        });

        let selectedProperties = [];

        $("#PropertyDropdown option:selected").each(function () {
            selectedProperties.push(parseInt($(this).val()));
        });

        let userData = {
            FullName: $('#FullNameTxt').val(),
            Email: $('#EmailTxt').val(),
            Mobile: $('#MobileTxt').val(),
            Role: $('#role').val(),
            PasswordHash: $('#PasswordHashTxt').val(),
            Permissions: selectedPermissions,
            UserID: $('#UserID').val(),
            Properties: selectedProperties
        };

        $.ajax({
            url: WebApiUrl + '/api/Users/UpdateInternaluser',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function (response) {
                if (response.success) {
                    alert(response.message);
                    //location.reload();
                    window.location.href = "/UserManagement/InternalUserList";
                } else {
                    alert("Error: " + response.message);
                }
            },
            error: function () {
                alert("Failed to save user.");
            }
        });
    });


    $('input.icheckbox').iCheck({
        checkboxClass: 'icheckbox_flat-green',
        increaseArea: '20%' // optional
    });

    // When a parent checkbox is clicked, check/uncheck all child checkboxes
    $('#permissionsTree').on('ifChanged', '.parent-checkbox', function () {
        let isChecked = $(this).prop('checked');
        let $parentDiv = $(this).closest('li');
        $parentDiv.find('.child-checkbox').iCheck(isChecked ? 'check' : 'uncheck');
    });

    // When a child checkbox is clicked, update the parent checkbox state
    $('#permissionsTree').on('ifChanged', '.child-checkbox', function () {
        let parentId = $(this).data('parent-id');
        let $parentCheckbox = $('#' + parentId);

        // Check if all siblings are checked
        let allSiblingsChecked = $('input[data-parent-id="' + parentId + '"]').length === $('input[data-parent-id="' + parentId + '"]:checked').length;

        // Check/uncheck parent based on siblings
        $parentCheckbox.iCheck(allSiblingsChecked ? 'check' : 'uncheck');
    });

    

    // Step 1: Load available permissions once (this will be done only the first time)
    function loadAvailablePermissions() {
        var UserID = $('#UserID').val();
        $.ajax({
            url: WebApiUrl + '/api/UserPageAccesses/' + UserID,  // Modify the URL to your actual API endpoint for available permissions
            type: 'GET',
            dataType: 'json',
            success: function (permissions) {
                availablePermissions = permissions;  // Store the permissions globally
                console.log('Available Permissions:', availablePermissions);

                GetPagesByRole($('#role').val());
            },
            error: function () {
                alert('Failed to fetch available permissions.');
            }
        });
    }

    loadAvailablePermissions();

    function GetPagesByRole(roleId) {
        $.ajax({
            url: WebApiUrl + '/api/Pages/GetPagesByRole',  // Modify the URL to your actual API endpoint for role-based permissions
            type: 'GET',
            data: { roleName: roleId },
            dataType: 'json',
            success: function (permissions) {
                console.log('Permissions:', permissions);

                // Build the permissions tree
                $('#permissionsTree').html(buildTree(permissions, null));

                // Loop through the permissions and check the checkboxes based on the availablePermissions
                permissions.forEach(function (permission) {
                    if (availablePermissions.includes(permission.id)) {
                        $('#' + permission.id).prop('checked', true).iCheck('update');
                    }
                });

                // Initialize iCheck after setting the checkbox states
                $('.icheckbox').iCheck({
                    checkboxClass: 'icheckbox_flat-green',  // You can choose a skin here
                    radioClass: 'iradio_flat-green'
                });

                // When a parent checkbox is clicked, check/uncheck all child checkboxes
                $('#permissionsTree').on('change', '.parent-checkbox', function () {
                    let isChecked = $(this).prop('checked');
                    $(this).closest('li').find('.child-checkbox').prop('checked', isChecked);
                });

                // When a child checkbox is clicked, check/uncheck the parent based on the state of all siblings
                $('#permissionsTree').on('change', '.child-checkbox', function () {
                    let parentId = $(this).data('parent-id');
                    let allSiblingsChecked = $('input[data-parent-id="' + parentId + '"]').length === $('input[data-parent-id="' + parentId + '"]:checked').length;

                    $('#' + parentId).prop('checked', allSiblingsChecked);
                });
            },
            error: function () {
                alert('Failed to fetch role-specific permissions.');
            }
        });
    }


    $('#role').change(function () {
        let roleId = $(this).val();
        if (roleId) {
            GetPagesByRole(roleId);
        } else {
            $('#permissionsTree').html('');
        }
    });
});

$(document).ready(function () {

    $('#MobileTxt').on('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length > 8) {
            this.value = this.value.slice(0, 8);
        }
    });
   
});

$(document).ready(function () {

    function generatePassword(length = 12) {
        const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowerCase = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const specialChars = "!@#$%^&*()_+";
        const allChars = upperCase + lowerCase + numbers + specialChars;

        if (length < 8) {
            throw new Error("Password length must be at least 8 characters.");
        }

        // Ensure at least one character from each required category
        let password = [
            upperCase.charAt(Math.floor(Math.random() * upperCase.length)),
            lowerCase.charAt(Math.floor(Math.random() * lowerCase.length)),
            numbers.charAt(Math.floor(Math.random() * numbers.length)),
            specialChars.charAt(Math.floor(Math.random() * specialChars.length)),
        ];

        // Fill the rest of the password length with random characters
        for (let i = password.length; i < length; i++) {
            password.push(allChars.charAt(Math.floor(Math.random() * allChars.length)));
        }

        // Shuffle the password to ensure randomness
        password = password.sort(() => 0.5 - Math.random());

        // Join the characters to form the final password
        return password.join("");
    }

    let modalInstance;

    function showModal(password) {
        $('#generatedPassword').val(password);
        modalInstance = new bootstrap.Modal(document.getElementById('passwordModal'));
        modalInstance.show();
    }

    $('#btnGeneratePassword').click(function () {
        const password = generatePassword();
        showModal(password);
    });

    $('#refreshPassword').click(function () {
        const password = generatePassword();
        $('#generatedPassword').val(password);
    });

    $('#copyPassword').click(function () {
        const password = $('#generatedPassword').val();
        navigator.clipboard.writeText(password).then(() => {
            alert('Password copied to clipboard!');
        }).catch(err => {
            alert('Failed to copy password: ' + err);
        });
    });

    handlePasswordEvent();

    $('#userPassword').click(function () {
        const password = $('#generatedPassword').val();
        $('#PasswordHashTxt').val(password);
        if (modalInstance) {
            modalInstance.hide();
        }
        handlePasswordEvent();
    });
});

const passwordInput = document.getElementById('PasswordHashTxt');
const strengthFill = document.getElementById('strengthFill');
const lengthCriteria = document.getElementById('length');
const uppercaseCriteria = document.getElementById('uppercase');
const lowercaseCriteria = document.getElementById('lowercase');
const digitCriteria = document.getElementById('digit');
const specialCriteria = document.getElementById('special');
const strengthMessage = document.getElementById('strengthMessage');

function handlePasswordEvent() {
    const password = passwordInput.value;

    // Check individual criteria
    const isLengthMet = password.length >= 8;
    const isUppercaseMet = /[A-Z]/.test(password);
    const isLowercaseMet = /[a-z]/.test(password);
    const isDigitMet = /[0-9]/.test(password);
    const isSpecialMet = /[@$!%*?&]/.test(password);

    updateCriteria(lengthCriteria, isLengthMet);
    updateCriteria(uppercaseCriteria, isUppercaseMet);
    updateCriteria(lowercaseCriteria, isLowercaseMet);
    updateCriteria(digitCriteria, isDigitMet);
    updateCriteria(specialCriteria, isSpecialMet);

    // Update progress bar
    const strength = calculateStrength(isLengthMet, isUppercaseMet, isLowercaseMet, isDigitMet, isSpecialMet);
    updateStrengthBar(strength);
}

passwordInput.addEventListener('input', handlePasswordEvent); // Trigger on typing
passwordInput.addEventListener('paste', handlePasswordEvent); // Trigger on paste
passwordInput.addEventListener('blur', handlePasswordEvent);  // Trigger on losing focus

function updateCriteria(element, isMet) {
    if (isMet) {
        element.classList.remove('not-met');
        element.classList.add('met');
    } else {
        element.classList.remove('met');
        element.classList.add('not-met');
    }
}

function calculateStrength(...criteria) {
    return criteria.filter(Boolean).length; // Count how many criteria are met
}

function updateStrengthBar(strength) {
    let width = (strength / 5) * 100; // Convert to percentage
    let className = '';
    let message = '';

    if (strength <= 2) {
        className = 'weak';
        message = 'Weak';
    } else if (strength === 3 || strength === 4) {
        className = 'medium';
        message = 'Medium';
    } else if (strength === 5) {
        className = 'strong';
        message = 'Strong';
    }

    strengthFill.style.width = width + '%';
    strengthFill.className = `strength-fill ${className}`;

    strengthMessage.textContent = message;
    $('.strength-bar').show();
}

$(document).ready(function () {

    let userId = $('#UserID').val();
    // Fetch distinct property names
    $.ajax({
        url: WebApiUrl + `/api/Users/GetDistinctPropertyNames/${userId}`,
        type: "GET",
        success: function (response) {
            console.log(response);
            $.ajax({
                url: WebApiUrl + '/api/Properties',
                method: 'GET',
                success: function (data) {
                    console.log(data);
                    var dropdown = $('#PropertyDropdown');
                    dropdown.empty(); // optional: clear existing options

                    $.each(data, function (index, item) {
                        var option = new Option(item.propertyName, item.propertyID);

                        if (response.includes(item.propertyName)) {
                            option.selected = true;
                        }

                        dropdown.append(option);
                    });

                    // If you're using a plugin like Select2 or Bootstrap Select, refresh it here
                    // $('#PropertyDropdown').trigger('change'); // optional
                },
                error: function () {
                    alert('Failed to load properties dropdown.');
                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Error fetching property names:", error);
        }
    });
});


