function buildTree(permissions, parentId) {
    let treeHtml = '<ul>';
    const filteredPermissions = permissions.filter(p => p.parentMenuId === parentId);

    filteredPermissions.forEach(menu => {
        let checkboxId = 'permission_' + menu.id;
        let hasChildren = permissions.some(p => p.parentMenuId === menu.id);

        treeHtml += '<li>';

        // Parent checkbox (main category)
        if (hasChildren) {
            treeHtml += '<input type="checkbox" class="icheckbox parent-checkbox" id="' + checkboxId + '" name="Permissions" value="' + menu.id + '">';
        } else {
            // Child checkboxes
            treeHtml += '<input type="checkbox" class="icheckbox child-checkbox" data-parent-id="permission_' + menu.parentMenuId + '" id="' + checkboxId + '" name="Permissions" value="' + menu.id + '">';
        }

        treeHtml += '<label for="' + checkboxId + '"> ' + menu.pageName + '</label>';

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
            Properties: selectedProperties
        };

        $.ajax({
            url: WebApiUrl + '/api/Users/CreateInternaluser',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function (response) {
                if (response.success) {
                    alert(response.message);
                    location.reload();
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

    $('#role').change(function () {
        let roleId = $(this).val();
        if (roleId) {
            $.ajax({
                url: WebApiUrl + '/api/Pages/GetPagesByRole',
                type: 'GET',
                data: { roleName: roleId },
                dataType: 'json',
                success: function (permissions) {
                    $('#permissionsTree').html(buildTree(permissions, null));

                    $('.icheckbox').iCheck({
                        checkboxClass: 'icheckbox_flat-green', // You can choose a skin here
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
                    alert('Failed to fetch permissions.');
                }
            });
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
            alert('Failed to load properties dropdown.');
        }
    });
   
});
