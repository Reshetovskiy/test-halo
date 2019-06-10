var navbar__toggle;

// navbar__toggle = document.getElementsByClassName('header-navigation__toggle');

// if(!!navbar__toggle[0] && screen.width < 960) {

//     for(var i = 0; i < navbar__toggle.length; i++) {

//         navbar__toggle[i].addEventListener('click', function(event) {

//             event.preventDefault();

//             var _all;

//             _all = document.querySelectorAll('.header-navigation__link');

//             for(var j = 0; j < _all.length; j++) {

//                 if(_all[j] !== event.target) {

//                     _all[j].parentNode.classList.remove('active');
//                 }
//             }

//             this.classList.toggle('active');
//         })
//     }
// }

// document.addEventListener('click', function(event) {

//     var _element = document.querySelectorAll('.header-navigation__toggle');

//     if(!!_element[0]) {
//         for(var i = 0; i < _element.length; i++) {

//             if (!_element[i].contains(event.target) && screen.width < 960) {

//                 _element[i].classList.remove('active');
//             };
//         }
//     }
// });

var toggle_menu;

toggle_menu = document.getElementsByClassName('toggle-button');

if(!!toggle_menu[0]) {

    for(var i = 0; i < toggle_menu.length; i++) {

        toggle_menu[i].addEventListener('click', function() {

            document.getElementsByClassName('header')[0].classList.toggle('active');
        })
    }
}