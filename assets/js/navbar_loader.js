function loadNavbar(level=1) {
  console.log('loading navbar, with level: ' + level);
  const sharedContentDiv = document.getElementById('navbar-loader');
  const xhr = new XMLHttpRequest();
  const prefix = '../'.repeat(level);
  console.log('getting: ' + prefix + 'navbar.html');
  xhr.open('GET', prefix + 'navbar.html', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // replace all "{level}" with the current prefix
      let responseText = xhr.responseText;
      responseText = responseText.replace(/{level}/g, prefix);
      sharedContentDiv.innerHTML = responseText;
    }
  };
  xhr.send();
}