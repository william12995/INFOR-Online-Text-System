function single(index, name, number) {

    var id = "#container" + index;
    $(id).append('<div class="form-group" ><div class="radio radio-primary"><label>選項A<textarea name = "A" rows = "2" cols = "30"> "<%="+ doc.post[0].choice[ (sum-1) ].A +"%>" </textarea></label></div><div class="radio radio-primary"><label>選項B <textarea name = "B" rows = "2" cols = "30"> "<%="+ doc.post[0].choice[ (sum-1) ].B"%>"</textarea></label></div><div class="radio radio-primary"><label>選項C<textarea name = "C" rows = "2" cols = "30"> "<%=" doc.post[0].choice[ (sum-1) ].C "%>"</textarea></label></div><div class="radio radio-primary"><label>選項D<textarea name = "D" rows = "2" cols = "30"> "<%=" doc.post[0].choice[ (sum-1) ].D "%>"</textarea></label></div></div>');

    $.material.init();
    var choice = 'single';
    var number = Number(number);

    var data = {
        name: name,
        choice: choice,
        number: number,
        index: index
    };

    $.ajax({
        type: 'POST',
        url: 'http://localhost:1209/choice',
        data: data,
        dataType: 'application/json',
        success: function (data) {
            console.log('success');
            console.log(data);
        }
    });
    location.reload(true);
}

function removeText(type, index, sum, name, number) {

    var choice;
    if (type == 'single') choice = 'single';
    if (type == 'multiple') choice = 'multiple';
    var number = number;

    var data = {
        name: name,
        choice: choice,
        number: number,
        index: index,
        sum: sum
    };

    $.ajax({
        type: 'POST',
        url: 'http://localhost:1209/removeChoice',
        data: data,
        dataType: 'application/json',
        success: function (data) {
            console.log('success');
            console.log(data);
        }
    });
    location.reload(true);
}

function multiple(index, name, number) {

    var id = "#container" + index;
    $(id).append('<div class="form-group" ><div class="checkbox"><label id="check">選項A<textarea name = "A" rows = "2" cols = "30"> "<%="+ doc.post[0].choice[ (sum-1) ].A +"%>" </textarea></span></label></div><div class="checkbox"><label id="check">選項B <textarea name = "B" rows = "2" cols = "30"> "<%="+ doc.post[0].choice[ (sum-1)].B"%>"</textarea></span></label></div><div class="checkbox"><label id="check">選項C<textarea name = "C" rows = "2" cols = "30"> "<%=" doc.post[0].choice[ (sum-1) ].C "%>"</textarea></span></label></div><div class="checkbox"><label id="check">選項D<textarea name = "D" rows = "2" cols = "30"> "<%=" doc.post[0].choice[ (sum-1) ].D "%>"</textarea></span></label></div></div>');

    $.material.init();
    var choice = 'multiple';
    var number = number;

    var data = {
        name: name,
        choice: choice,
        number: number,
        index: index
    };

    $.ajax({
        type: 'POST',
        url: 'http://localhost:1209/choice',
        data: data,
        dataType: 'application/json',
        success: function (data) {
            console.log('success');
            console.log(data);
        }
    });
    location.reload(true);
}

function removeall(name, index) {
    var data = {
        name: name,
        index: index
    };

    $.ajax({
        type: 'POST',
        url: 'http://localhost:1209/testremove',
        data: data,
        dataType: 'application/json',
        success: function (data) {
            console.log('success');
            console.log(data);
        }
    });
    location.reload(true);
}

function insert(name, index) {
    var data = {
        name: name,
        index: index
    };

    $.ajax({
        type: 'POST',
        url: 'http://localhost:1209/testInsert',
        data: data,
        dataType: 'application/json',
        success: function (data) {
            console.log('success');
            console.log(data);
        }
    });
    location.reload(true);
}

function sectionFocus(id) {
    var containerId = '#container' + id.toString();
    var btnGrouptId = '#btn-group-' + id.toString();
    $(containerId).css('box-shadow', '0px 0px 20px 0px rgba(0, 0, 0, 0.2), 0 10px 30px 0 rgba(0, 0, 0, 0.19)');
    $(containerId).css('border-left', 'solid #009688');
    $(btnGrouptId).show();
}

function sectionFocusOut(id) {
    var titleId = '#title' + id.toString();
    var editId = '#title-edit' + id.toString();
    var containerId = '#container' + id.toString();
    var btnGrouptId = '#btn-group-' + id.toString();
    $(containerId).css('box-shadow', '0px 0px 0px 0px');
    $(containerId).css('border-left', '0px');
    $(btnGrouptId).hide();
    $(titleId).show();
    $(editId).hide();
}

function edit(id) {
    var titleId = '#title' + id.toString();
    var editId = '#title-edit' + id.toString();
    $(titleId).hide();
    $(editId).show();
    $(editId).focus();
}

function h(e) {
    $(e).css({
        'height': 'auto',
        'overflow-y': 'hidden'
    }).height(e.scrollHeight - 15);
}

$('textarea').each(function () {
    h(this);
}).on('focus', function () {
    h(this);
});
