// Intersystplus related functions

isp = {

	init: function() {
		this.stickMenu();
		this.toggleMenu();
		this.handleResize();        
		this.handleScroll();
		this.parallax();
        this.disableButtonsOnPageTab(); // need to be tuned up to init only in admin     
        return this;
    },
    // Stick menu if on mobile
    stickMenu: function() {
    	if ($(window).width() < 768) {
    		$('.menu-js').addClass('sticky');
    		$('body').addClass('static');
    	}
    	if ($(window).width() > 768) {
    		$('.menu-js').removeClass('sticky');
    		$('body').removeClass('static');
    	}
    },
    // Function to handle resize events
    handleResize: function() {
    	var $this = isp;
    	$(window).on('resize',function(){
    		$this.stickMenu();
    		$this.parallax();
    	})
    },
    // Function to handle scroll events
    handleScroll: function() {
    	var $this = isp;
    	$(window).on('scroll', function() {
    		if ($(window).width() >= 1200) {
    			$this.parallax();
    		}
    	});
    },
    // Function to show or hide menu when screen width < 768
    toggleMenu: function() {
    	$('.menu__trigger-js').on('click',function(e){
    		e.preventDefault();
    		if ($('.menu__trigger-js').hasClass('open') === false) {
    			$('.menu__trigger-js').addClass('open');
    			$('.menu__items-js').stop(false, true).slideDown();
    		} else {
    			$('.menu__trigger-js').removeClass('open');
    			$('.menu__items-js').stop(false, true).slideUp();
    		}
    	});
    	$('.menu-js').on('blur',function(e){
    		$('.menu__trigger-js').removeClass('open');
    		$('.menu__items-js').stop(false, true).slideUp();
    	});
    	$(window).on('resize',function(){
    		if($(window).width() > 768) {
    			$('.menu__items-js').attr('style','');
    			$('.menu__trigger-js').removeClass('open');
    		}
    	})
    },
    // Function to show or hide contact-box within a menu
    toggleContactBox: function() {
    	$('.contact-js').on('click',function(e){
    		e.preventDefault();
    		if ($('.contact-js').hasClass('open') === false) {
    			$('.contact-js').addClass('open');
    			$('.contact-box-js').stop(false, true).slideDown();
    		} else {
    			$('.contact-js').removeClass('open');
    			$('.contact-box-js').stop(false, true).slideUp();
    		}
    	})
    },
    // Functions for parallax effect on home main top bg 
    parallax: function() {
    	if (!$('body').hasClass('static')) {
    		var scrolled = $(window).scrollTop();
    		$('.parallax-js').css({
    			'background-position': '5%' + -(scrolled * .3) + 'px',
    			'background-attachment': 'fixed'
    		});
    	}
    	else {
    		$('.parallax-js').css({
    			'background-position': '0 0',
    			'background-attachment': 'scroll'
    		});
    	}    	
    },
    // Function to hold portfolio initializers and lightbox (taken from main.js - Cubeportfolio)
    initPortfolio: function(element) {
        // init cubeportfolio
        $('#grid-container').cubeportfolio({
        	filters: '#filters-container',
        	loadMore: '#loadMore-container',
        	loadMoreAction: 'click',
        	layoutMode: 'grid',
        	mediaQueries: [{
        		width: 1100,
        		cols: 4
        	}, {
        		width: 800,
        		cols: 3
        	}, {
        		width: 500,
        		cols: 2
        	}, {
        		width: 320,
        		cols: 1
        	}],
        	defaultFilter: '*',
        	animationType: 'rotateSides',
        	gapHorizontal: 10,
        	gapVertical: 10,
        	gridAdjustment: 'responsive',
        	caption: 'overlayBottomPush',
        	displayType: 'sequentially',
        	displayTypeSpeed: 100,

            // lightbox
            lightboxDelegate: '.cbp-lightbox',
            lightboxGallery: true,
            lightboxTitleSrc: 'data-title',
            lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} z {{total}}</div>',

            // singlePageInline
            singlePageInlineDelegate: '.cbp-singlePageInline',
            singlePageInlinePosition: 'below',
            singlePageInlineInFocus: true,
            singlePageInlineCallback: function(url, element) {
                // to update singlePageInline content use the following method: this.updateSinglePageInline(yourContent)
                var t = this;

                $.ajax({
                	url: url,
                	type: 'GET',
                	dataType: 'html',
                	timeout: 20000
                })
                .done(function(result) {

                	t.updateSinglePageInline(result);

                })
                .fail(function() {
                	t.updateSinglePageInline('Detail reference se nepovedl načíst. Zkuste prosím obnovit stránku (tlačítkem F5). Děkujeme za pochopení.');
                });
            },
        });
    },

    // CubePortfolio call functions (taken from main.js)
    // Used on Reference
    initPortfolioWork: function(element) {
        // init cubeportfolio
        $('#grid-container-work').cubeportfolio({
        	layoutMode: 'grid',
        	mediaQueries: [{
        		width: 1100,
        		cols: 2
        	}, {
        		width: 800,
        		cols: 2
        	}, {
        		width: 500,
        		cols: 1
        	}, {
        		width: 320,
        		cols: 1
        	}],
        	defaultFilter: '*',
        	animationType: 'rotateSides',
        	gapHorizontal: 10,
        	gapVertical: 10,
        	gridAdjustment: 'responsive',
        	displayType: 'sequentially',
        	displayTypeSpeed: 100,
        	caption: 'fadeIn',

            // singlePage popup
            singlePageDelegate: '.cbp-singlePage',
            singlePageDeeplinking: true,
            singlePageStickyNavigation: true,
            singlePageCounter: '<div class="cbp-popup-singlePage-counter">{{current}} z {{total}}</div>',
            singlePageCallback: function(url, element) {
                // to update singlePage content use the following method: this.updateSinglePage(yourContent)
                var t = this;

                $.ajax({
                	url: url,
                	type: 'GET',
                	dataType: 'html',
                	timeout: 10000
                })
                .done(function(result) {
                	t.updateSinglePage(result);
                })
                .fail(function() {
                	t.updateSinglePage('AJAX Error! Please refresh the page!');
                });
            },
        });
    },

    // CubePortfolio
    // Examples slider - used on Nabidka
    initSlider: function() {        
    	$('.cbp-l-grid-clients').cubeportfolio({
    		layoutMode: 'slider',
    		drag: true,
    		auto: false,
    		autoTimeout: 3000,
    		autoPauseOnHover: true,
    		showNavigation: true,
    		showPagination: true,
    		rewindNav: true,
    		scrollByPage: false,
    		gridAdjustment: 'responsive',
    		mediaQueries: [{
    			width: 1100,
    			cols: 4
    		}, {
    			width: 800,
    			cols: 3
    		}, {
    			width: 500,
    			cols: 3
    		}, {
    			width: 320,
    			cols: 2
    		}],
    		gapHorizontal: 0,
    		gapVertical: 5,
    		caption: 'zoom',
    		displayType: 'lazyLoading',
    		displayTypeSpeed: 100,
    	});
    },

    // Disable button click in order to be able edit links and buttons
    disableButtonsOnPageTab: function() {
    	$('.button', '.EditMode').on('click',function(e){
    		e.preventDefault();
    	});
    }
}