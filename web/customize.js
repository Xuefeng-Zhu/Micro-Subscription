$beforeForm = $('#before-form')

$beforeForm.on('submit', function (event) {
  event.preventDefault()
  $address = $('#user-address')
  $afterForm = $('#after-form')

  $beforeForm.hide()
  $afterForm.show()

  $.ajax({ method: 'PUT', url: 'https://test-f3f04.firebaseio.com/user.json', data: `"${$address.val()}"` })
})