var url = "https://users-pg-backend.onrender.com/api/users";

function postUser() {
  var myName = $('#name').val().trim();
  var myEmail = $('#email').val().trim();
  var myAge = $('#age').val().trim();
  var myComments = $('#comments').val().trim();

  if (!myName || !myEmail) {
    alert('Name and Email are required!');
    return;
  }

  var myuser = {
    name: myName,
    email: myEmail,
    age: myAge || null,
    comments: myComments || null
  };

  $.ajax({
    url: url,
    type: 'post',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(myuser),
    success: function () {
      getUsers();
      $('#name').val('');
      $('#email').val('');
      $('#age').val('');
      $('#comments').val('');
    },
    error: function () {
      alert('Error al guardar usuario');
    }
  });
}

function getUsers() {
  $.getJSON(url, function (response) {
    var users = Array.isArray(response) ? response : response.users;

    var htmlTableUsers = `
      <table border="1" style="border-collapse: collapse; width: 100%; margin-top: 1em;">
        <thead style="background-color: #f0f0f0;">
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Age</th><th>Comments</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
    `;

    users.forEach(function (item) {
      htmlTableUsers += `
        <tr>
          <td>${item.id}</td>
          <td>${item.name || '-'}</td>
          <td>${item.email || '-'}</td>
          <td>${item.age || '-'}</td>
          <td>${item.comments || '-'}</td>
          <td>
            <button onclick="showEditModal(${item.id}, '${item.name.replace(/'/g, "\\'")}', '${item.email}', ${item.age}, \`${item.comments || ''}\`)">Editar</button>
            <button onclick="deleteUser(${item.id})">Eliminar</button>
          </td>
        </tr>
      `;
    });

    htmlTableUsers += '</tbody></table>';
    $('#resultado').html(htmlTableUsers);
  }).fail(function () {
    alert('Error al obtener usuarios');
  });
}

function showEditModal(id, name, email, age, comments) {
  $('#edit-id').val(id);
  $('#edit-name').val(name);
  $('#edit-email').val(email);
  $('#edit-age').val(age);
  $('#edit-comments').val(comments);
  $('#editModal').show();
}

function updateUser() {
  const id = $('#edit-id').val();
  const data = {
    name: $('#edit-name').val().trim(),
    email: $('#edit-email').val().trim(),
    age: $('#edit-age').val().trim(),
    comments: $('#edit-comments').val().trim()
  };

  $.ajax({
    url: `${url}/${id}`,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function () {
      $('#editModal').hide();
      getUsers();
    },
    error: function () {
      alert('Error al actualizar usuario');
    }
  });
}

function deleteUser(id) {
  if (confirm('¿Seguro que deseas eliminar este usuario?')) {
    $.ajax({
      url: `${url}/${id}`,
      type: 'DELETE',
      success: function () {
        getUsers();
      },
      error: function () {
        alert('Error al eliminar usuario');
      }
    });
  }
}
