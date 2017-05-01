function single(index, name) {

  var choice = 'single';

  var data = {
    name: name,
    choice: choice,
    index: index
  };

  $.ajax({
    type: 'POST',
    url: 'http://localhost:1209/choice',
    data: data,
    dataType: 'application/json',
    success: function(data) {
      console.log('success');
      console.log(data);
    }
  });
  location.reload(true);
}

function removeText(index, sum, name) {

  var data = {
    name: name,
    index: index,
    sum: sum
  };

  $.ajax({
    type: 'POST',
    url: 'http://localhost:1209/removeChoice',
    data: data,
    dataType: 'application/json',
    success: function(data) {
      console.log('success');
      console.log(data);
    }
  });
  location.reload(true);
}

function multiple(index, name) {

  var choice = 'multiple';

  var data = {
    name: name,
    choice: choice,
    index: index
  };

  $.ajax({
    type: 'POST',
    url: 'http://localhost:1209/choice',
    data: data,
    dataType: 'application/json',
    success: function(data) {
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
    success: function(data) {
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
    success: function(data) {
      console.log('success');
      console.log(data);
    }
  });
  location.reload(true);
}

function insertOption(name, index, sum) {
  var data = {
    name: name,
    index: index,
    sum: sum
  };

  $.ajax({
    type: 'POST',
    url: 'http://localhost:1209/insertOption',
    data: data,
    dataType: 'application/json',
    success: function(data) {
      console.log('success');
      console.log(data);
    }
  });
  location.reload(true);
}

function removeOneOption(name, index, sum) {
  var data = {
    name: name,
    index: index,
    sum: sum
  };

  $.ajax({
    type: 'POST',
    url: 'http://localhost:1209/removeOneOption',
    data: data,
    dataType: 'application/json',
    success: function(data) {
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

$('textarea').each(function() {
  h(this);
}).on('focus', function() {
  h(this);
});
