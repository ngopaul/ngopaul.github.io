// add event listener on load
window.addEventListener('load', function() {

$('document').ready(function(e) {
  $('.btn').collapse({toggle: true});
});

// scroll to home
document.querySelector('.js-scroll-to-home').addEventListener('click', function(e) {
  e.preventDefault();
  document.querySelector('.home').scrollIntoView({ behavior: 'smooth' });
});

// scroll to contact
document.querySelector('.js-scroll-to-contact').addEventListener('click', function(e) {
  e.preventDefault();
  document.querySelector('.contact').scrollIntoView({ behavior: 'smooth' });
});

// scroll to background
document.querySelector('.js-scroll-to-background').addEventListener('click', function(e) {
  e.preventDefault();
  document.querySelector('.background').scrollIntoView({ behavior: 'smooth' });
});

// scroll to projects
document.querySelector('.js-scroll-to-projects').addEventListener('click', function(e) {
  e.preventDefault();
  document.querySelector('.projects').scrollIntoView({ behavior: 'smooth' });
});

// scroll to hobbies
document.querySelector('.js-scroll-to-hobbies').addEventListener('click', function(e) {
  e.preventDefault();
  document.querySelector('.hobbies').scrollIntoView({ behavior: 'smooth' });
});

});

$('body').scrollspy({ target: '#navbar-example' })