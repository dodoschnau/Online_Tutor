// if user uploads an avatar, this event listener will be triggered
document.getElementById('avatar-upload').addEventListener('change', function (e) {
  const file = e.target.files[0]
  if (file) {
    // create a new FileReader object
    const reader = new window.FileReader()
    // set the function to be called when the file is read
    reader.onload = function (e) {
      document.getElementById('avatar-preview').src = e.target.result
    }
    // when the file is read, convert it to a data URL
    reader.readAsDataURL(file)
  }
})
