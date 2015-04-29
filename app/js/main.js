var LightBox = (function(){

    function _setUpListners(){
        $('.add-work').on('click', _showLightBox);
        $('.close-button').on('click', _hideLightBox);
        $('.add-project-overlay').on('click', _hideLightBox);
        $('.open-button').on('click', _showOpenDialog);
        $('#image-field').on('change', _insertFileName);
    }

    function _showLightBox(ev){
        ev.preventDefault;
        $('.add-project-overlay').show();
        $('.add-project-form').show();
    }

    function _hideLightBox(ev){
        ev.preventDefault;
        FormSend.clearForm();
        $('.add-project-overlay').hide();
        $('.add-project-form').hide();
    }

    function _showOpenDialog(ev){
        ev.preventDefault;
        $('#image-field').click();
    }

    function _insertFileName(ev){
        var file = ev.target.value,
            insertTo = $('#image-url-field'),
            filename = file.split('\\').pop();

        insertTo.val(filename);
        _clearTooltip(insertTo);
    }

    function _clearTooltip(field) {
        var container = field.parent(),
            tooltip = container.find('.tooltip');

        if (field.hasClass('error')) {
            field.removeClass('error');
            tooltip.remove();
        }

    }

    return {
        init: function(){
            _setUpListners();
        }
    }

}());

var FormSend = (function(){

    function _setUpListners(){
        $('form').on('submit', _showResult);
        $('form').on('reset', _clearForm);
        $('form').on('keydown', '.input', _clearTooltip);
    }

    function _showResult(ev){
        ev.preventDefault();

        var form = $(this);

        if (form.attr('name') == 'add-project') {
            url = '/project.php';
        } else if (form.attr('name') == 'auth-form') {
            url = '/login.php';
        } else if (form.attr('name') == 'contact-form') {
            url = '/contact.php';
        }

        if (_validation($(this))) {
            var formSend = _ajaxForm(form, url);
            formSend.done(function(answer){

            });
        }
    }

    function _ajaxForm(form, url){

        var data = form.serialize(),

            defObj = $.ajax({
                type : "POST",
                url : url,
                dataType : "JSON",
                data: data
            }).fail( function(){
                console.log('Проблемы на стороне сервера');
            })

        return defObj;
    }

    function _validation(form){
        var fields = form.find('input[type="text"], textarea'),
            result = true;

        $.each(fields, function(index, val) {
            var field = $(val),
                value = field.val();

            if (value == '') {
                if (field.data('tpos') == 'left') {

                    field.before('<div class="tooltip tooltip-left">' + field.data('ttext') + '</div>');
                } else {
                    field.before('<div class="tooltip tooltip-right">' + field.data('ttext') + '</div>'); 
                }
                field.addClass('error');
                result = false;
            }
        });

        return result;
    }

    function _clearForm() {
        var form = $('form'), 
            fields = form.find('.input');

        $.each(fields, function(index, val) {
            var field = $(val),
                container = field.parent(),
                tooltip = container.find('.tooltip');

            field.val('');
            field.removeClass('error');
            tooltip.remove();
        });
    }

    function _clearTooltip(ev) {
        var field = $(this),
            container = field.parent(),
            tooltip = container.find('.tooltip');

        if (field.hasClass('error')) {
            field.removeClass('error');
            tooltip.remove();
        }

    }

    // Возвращаем в глобальную область видимости
    return {
        init: function () {
            _setUpListners();
        },
        clearForm: function () {
            _clearForm();
        },
        clearToolTip: function () {
            _clearTooltip();
        }
    }

}());

$(document).ready(function(){
    if ($('form').length) {
        FormSend.init();
    }
    if ($('.add-project-form').length) {
        LightBox.init();
    }
});
