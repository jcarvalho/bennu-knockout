function loadRequire(url, callback) {
	// adding the script tag to the head as suggested before
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;

	// then bind the event to the callback function 
	// there are several events for cross browser compatibility
	script.onreadystatechange = callback;
	script.onload = callback;

	// fire the loading
	head.appendChild(script);
}

loadRequire('../bennu-knockout/libs/require.js', function() {

	// Configure default paths
	requirejs.config({
		baseUrl: 'js',
	    paths: {
	        jquery: '../../bennu-knockout/libs/jquery',
	        i18n: '../../bennu-knockout/libs/i18n',
	        knockout: '../../bennu-knockout/libs/knockout',
	        'bennu-knockout': '../../bennu-knockout/bennu-knockout',
	    },
	    // And the i18n plugin
		config: {
	        i18n: {
	            locale: (typeof BennuPortal !== "undefined") ? BennuPortal.locale.tag.toLowerCase() : "en-en"
	        }
    	}
	});

	// Initialize bennu-knockout
	require(['bennu-knockout'], function(bennuKo) {
		bennuKo.initialize();		
	});

	// Run the application
    require(['main']);

});
