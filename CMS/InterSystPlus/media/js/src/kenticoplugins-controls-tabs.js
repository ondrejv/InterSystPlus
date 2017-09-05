// Requires jQuery.
if (typeof jQuery === 'undefined') {
    throw new Error("KenticoPlugins.Controls.Tabs error: jQuery is undefined!");
}

// Define namespace if it doesn't exist.
var KenticoPlugins = KenticoPlugins || {};
KenticoPlugins.Controls = KenticoPlugins.Controls || {};

KenticoPlugins.Controls.Tabs = function (tabContainer, options) {

    // Tab container element
    this.tabContainer = tabContainer;

    // Behavior options
    this.options = options ||
    {
        // Set true if you want to propagate selected tab ID into url. Default is false.
        useHashTagNavigation: $(this.tabContainer).data('use-hashtag-navigation') || false,
    };

    // True if control is in compact mode
    this.isCompact = false;

    var tabLabelContainer = $('.tabs__header .tabs__labels', this.tabContainer);
    var tabLabels = $('.tabs__header .tabs__label', this.tabContainer);
    var tabContents = $('.tabs__body .tabs__content', this.tabContainer);
    var dropDown = $('.tabs__dropdown', this.tabContainer);

    var priv = this;

    // Initializes tab functionality.
    var initialize = function () {

        // Bind click event on every tab label.
        $('a', tabLabels).click(function (e) {
            e.preventDefault();
            e.stopPropagation();

            var id = $(this).attr('href');
            priv.setActiveTab(id);

            if (priv.options.useHashTagNavigation) {
                updateHashTagInUrl(id);
            }
        });

        // Set active tab according to hash tag from url if it's enabled in options.
        if (priv.options.useHashTagNavigation && window.location.hash != '') {
            priv.setActiveTab(window.location.hash);
        }

        // Check if compact mode has changed after every page load and window resize.
        $(window).on('resize orientationchange load', function () {
            var isCompactAfterResize = getIsCompact();
            if (isCompactAfterResize != priv.isCompact) {
                priv.isCompact = isCompactAfterResize;
                compactModeChanged();
            }

                // Show arrow if needed
            else {
                if (priv.options.useScrollSwipe) {
                    ensureArrowAndShadow();
                }
            }
        });

        // Collapse populated dropdown if user clicks outside.
        $(document).click(function (e) {
            if (priv.isCompact && $(tabLabelContainer).is(':visible')) {
                e.stopPropagation();
                toggleDropDown();
            }
        });

        if (priv.options.useScrollSwipe) {

            // Left arrow click
            $(arrowLeft).click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                scrollTabsHorizontally('left');
            });

            // Right arrow click
            $(arrowRight).click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                scrollTabsHorizontally('right');
            });

            // Swipe action
            swipeTabsHorizontally();
        }
    }

    // Sets the active tab accoring given ID.
    this.setActiveTab = function (id) {

        if (id != "#") {
            var tabWithId = $(id, tabContainer);

            if (tabWithId.length > 0) {
                $(tabLabels).removeClass('tabs__label--active');
                $('a[href=' + id + ']', tabLabels).parent('.tabs__label').addClass('tabs__label--active');
                $(tabContents).removeClass('tabs__content--active');
                $(tabWithId).addClass('tabs__content--active');
            }

            // Refresh dropdown selected value if control is in compact mode.
            if (priv.isCompact) {
                $('span', $(dropDown)).html(priv.getActiveTabName());
                toggleDropDown();
            }
        }

        // CUSTOM
        // Re-init slider because tab content is hidden and thus it's impossible to count widths  
        if ($('.cbp-l-grid-clients .cbp-wrapper').attr('style')) { 
            $('.cbp-l-grid-clients').cubeportfolio('destroy');
            isp.initSlider();
        }
        

    }

    // Gets the active tab.
    this.getActiveTabLabel = function () {
        var activeTabLabels = $('.tabs__label--active', $(priv.tabContainer));
        if (activeTabLabels.length > 0) {
            return activeTabLabels[0];
        }
        else {
            return null;
        }
    }

    // Gets the name of currently active tab.
    this.getActiveTabName = function () {
        var activeTabLabel = priv.getActiveTabLabel();
        if (activeTabLabel != null) {
            return $('a', activeTabLabel).html();
        }
        else {
            return '';
        }
    }

    // Gets the ID of currently active tab.
    this.getActiveTabId = function () {
        var activeTabLabel = priv.getActiveTabLabel();
        if (activeTabLabel != null) {
            return $('a', activeTabLabel).attr('href');
        }
        else {
            return '';
        }
    }

    // Updates hash tag in url.
    var updateHashTagInUrl = function (id) {

        // Ensure URL contains correct hash
        if (window.location.hash != id) {

            // Temporarily remove ID to prevent scrolling when modifying location hash
            var targetedContentElement = $(id, tabContainer).attr("id", "");
            window.location.hash = id;
            $(targetedContentElement).attr("id", id.replace('#', ''));
        }
    }

    // Returns true if control is in compact mode.
    var getIsCompact = function () {
        return $(dropDown).is(":visible");
    }

    // Calls when compact mode has changed.
    var compactModeChanged = function () {

        if (priv.isCompact) {

            // Show dropdown if control has switched into compact mode.
            dropDown.show()
                .click(function (e) {
                    e.stopPropagation();
                    toggleDropDown();
                });

            $('span', $(dropDown)).html(priv.getActiveTabName());
            $(priv.tabContainer).addClass('tabs--compact');
            $(tabLabelContainer).hide();
        }
        else {

            // Otherwise destroy dropdown.
            $(dropDown).unbind('click');
            $(priv.tabContainer).removeClass('tabs--compact');
            $(tabLabelContainer).show();
        }
    }

    // Populates or collapses dropdown according to its current state.
    var toggleDropDown = function () {
        if ($(tabLabelContainer).is(':visible')) {
            $(tabLabelContainer).stop().slideUp(200, function () {
                $('i:not(.service__icon)', dropDown).attr('class', 'icon-chevron-down');
            });
        }
        else {
            $(tabLabelContainer).stop().slideDown(200, function () {
                $('i:not(.service__icon)', dropDown).attr('class', 'icon-chevron-up');
            });
        }
    }

    // Let's trigger initialization.
    initialize();
}


// Automatically assign tab functionality for all elements with class "js-tabs" on page.
$(document).ready(function () {
    var tabContainersOnPage = $('.js-tabs');
    $.each(tabContainersOnPage, function (index, tabContainer) {
        new KenticoPlugins.Controls.Tabs($(tabContainer));
    });
});