/*!
=========================================================
* Dorang Landing page
=========================================================

* Copyright: 2019 DevCRUD (https://devcrud.com)
* Licensed: (https://devcrud.com/licenses)
* Coded by www.devcrud.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/


window.addEventListener('load', () => {
	const $recaptcha = document.querySelector('#g-recaptcha-response');
	if ($recaptcha) {
	  $recaptcha.setAttribute('required', 'required');
	}
})

// toggle 
$(document).ready(function(){
    // cookie policy
    if (document.cookie.indexOf("accepted_cookies=") < 0) {
        $(".cookie-overlay").removeClass("d-none").addClass("d-block");
      }
    
      $(".accept-cookies").on("click", function () {
        document.cookie = "accepted_cookies=yes;";
        $(".cookie-overlay").removeClass("d-block").addClass("d-none");
      });
    
      // expand depending on your needs
      $(".close-cookies").on("click", function () {
        $(".cookie-overlay").removeClass("d-block").addClass("d-none");
      });

    /* Theme cookie */
    var cookie = getCookie("theme");

    if (cookie == "light") {
        $('body').addClass('light-theme');
        $('body').removeClass('dark-theme');
    }
    else if (cookie == "dark") {
        $('body').addClass('dark-theme');
        $('body').removeClass('light-theme');
    }
    else {
        // Load light-thema by default
        $('body').addClass('light-theme');
        $('body').removeClass('dark-theme');
        setCookie("theme", "light", 30);
    }

    
    $('.search-toggle').click(function(){
        $('.search-wrapper').toggleClass('show');
    });

    $('.modal-toggle').click(function(){
        $('.modalBox').toggleClass('show');
    })

    $('.modalBox').click(function(){
        $(this).removeClass('show');
    });

    $('.spinner').click(function(){
        $(".theme-selector").toggleClass('show');
    });
    $('.light').click(function(){
        $('body').addClass('light-theme');
        $('body').removeClass('dark-theme');
        setCookie("theme", "light", 30);
    });
    $('.dark').click(function(){
        $('body').addClass('dark-theme');
        $('body').removeClass('light-theme');
        setCookie("theme", "dark", 30);
    });

	$("#geboortedatum").click(function(){
		$("#geboortedatum").attr("type", "date")
	});
});

// Create cookie
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Delete cookie
function deleteCookie(cname) {
    const d = new Date();
    d.setTime(d.getTime() + (24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=;" + expires + ";path=/";
}

// Read cookie
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Set cookie consent
function acceptCookieConsent(){
    deleteCookie('user_cookie_consent');
    setCookie('user_cookie_consent', 1, 30);
    document.getElementById("cookieNotice").style.display = "none";
}


// smooth scroll
$(document).ready(function(){
    $(".navbar .nav-link").on('click', function(event) {

        if (this.hash !== "") {

            event.preventDefault();

            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 700, function(){
                window.location.hash = hash;
            });
        } 
    });
}); 
