define(['jquery', 'knockout', 'i18n!nls/messages'], function($, ko, messages) {

	var appContents = {

	};

	var getTemplate = function(templateName, callback) {
		var fullUrl = 'template/' + templateName + '.html';
		console.log("Fetching: " + fullUrl);
		$.ajax({
			type: "GET",
			url: fullUrl,
			dataType: "text",
			success: function(template, status, response) {
				callback(template, status, response);
			}
		});
	};

	ko.bindingHandlers.app = {
	    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			$(element).append("<div id='bennu-ko-container'></div>");
			getAppContentsForView(valueAccessor());
	    },
	    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			viewModel = appContents[valueAccessor()];
			if(!viewModel.template) {
				viewModel = viewModel['_$bennuKo$_parent'];
			}
			var templateName = viewModel.template();
			if(templateName) {
				getTemplate(templateName, function(template) {
					var el = $(element).find("#bennu-ko-container");
					el.html(template);
					ko.cleanNode(el[0]);
					ko.applyBindings(viewModel.selectedViewModel(), el[0]);
				});
			}
	    }
	};

	var idCounter = 0;

	ko.bindingHandlers.pager = {
	    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		    var collection = ko.utils.unwrapObservable(valueAccessor());
		    var id = '__$pager' + idCounter++ ;

		    var pagerModel = viewModel[id] = {};

		    var itemsPerPage = 3;

		    var currentPageObs = ko.observable(1);
		    pagerModel['currentPage'] = currentPageObs;
		    pagerModel['pagedArray'] = ko.computed(function() {
		    	var firstItemIndex = itemsPerPage * (currentPageObs() -1);
		    	return collection.slice(firstItemIndex, firstItemIndex + itemsPerPage);
		    });

		    var numPages = pagerModel['numPages'] = ko.computed(function() {
		    	return Math.ceil(collection.length / itemsPerPage);
		    });

		    pagerModel['next'] = function() {
		    	if(currentPageObs() < numPages()) {
			    	currentPageObs(currentPageObs() + 1);
			    }
		    }

		    pagerModel['previous'] = function() {
		    	if(currentPageObs() > 1) {
			    	currentPageObs(currentPageObs() - 1);
			    }
		    }

		    $(element).prepend('<!-- ko foreach: ' + id +'.pagedArray -->');
		    $(element).append('<!-- /ko -->');

		    $(element).append('<!-- ko with: ' + id +' -->\
		    	<div class="pagination pagination-small">\
		    		<ul>\
		    			<li data-bind="css: { disabled: currentPage() == 1 }"><a href="#" data-bind="click: previous">&laquo;</a></li>\
		    			<li data-bind="css: { disabled: currentPage() == numPages() }"><a href="#" data-bind="click: next">&raquo;</a></li>\
		    		</ul>\
		    	</div><!-- /ko -->');
	    }
	};

	var getMessage = function(key) {
		if(messages[key]) {
			return messages[key];
		} else {
			return '!i18n!' + key + '!/i18n!';
		}
	}

	ko.bindingHandlers.i18n = {
	    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
			var text = getMessage(ko.utils.unwrapObservable(valueAccessor()));
			var index = 0;
			while((index = text.indexOf('{', index + 1)) > 0) {
				var closeIndex = text.indexOf('}', index);
				var subStr = text.substring(index + 1, closeIndex);
				text = text.replace('{' + subStr + '}', ko.utils.unwrapObservable(viewModel[subStr]));
			}
			$(element).html(text);
	    }
	}

	var getAppContentsForView = function(appName) {
		var template = appContents[appName];
		if(!template) {
			appContents[appName] = template = {
				template: ko.observable(),
				selectedViewModel: ko.observable(null)
			};
		}
		return template;
	}

	return {

		loadPage: function(appName, viewModel, template) {
			var targetModel = getAppContentsForView(appName);
			viewModel['_$bennuKo$_parent'] = targetModel;
			targetModel.selectedViewModel(viewModel);
			targetModel.template(template);
		},

		initialize: function() {
			ko.applyBindings(appContents);
			console.log("Successfully initialized bennu-knockout");
		}

	};
});

