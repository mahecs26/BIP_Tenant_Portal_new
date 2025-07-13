$(document).ready(function () {
    $('#FlatTypeDropdown').change(function () {
        var flatType = $(this).val();
        console.log(flatType);
        console.log(flatType === 'Residential');
        if (flatType === 'Residential') {
            $('#noofroomsDiv').show();

            $('#areaDiv').hide();
            $('#sizeDiv').hide();
        }
        else {
            $('#areaDiv').show();

            $('#noofroomsDiv').hide();
            $('#sizeDiv').show();
        }
    });
});