function loadRequire(url, callback) {
	// adding the script tag to the head as suggested before
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	script.async = true;

	// then bind the event to the callback function 
	// there are several events for cross browser compatibility
	script.onreadystatechange = callback;
	script.onload = callback;

	// fire the loading
	head.appendChild(script);
}


var require = {
    baseUrl: 'js',
    paths: {
        jquery: '../../bennu-knockout/libs/jquery',
        i18n: '../../bennu-knockout/libs/i18n',
        knockout: '../../bennu-knockout/libs/knockout',
        'bennu-knockout': '../../bennu-knockout/bennu-knockout',
    }
};

loadRequire('../bennu-knockout/libs/require.js', function() {
    require(['main']);
});
