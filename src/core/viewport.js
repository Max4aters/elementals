import * as Events from './events';
import * as viewports from './viewports';
import * as Toolkit from './toolkit'

var viewport;

/**
 * Check if the current window has an offset
 *
 * @param namespace
 * @returns {boolean}
 */
export function windowHasOffset(namespace) {
    var heightOffset = window.scrollTop(),
        totalHeight = heightOffset + Toolkit.height(window),
        viewHeight = namespace.getBoundingClientRect(),
        hasOffset = false;

    // If we have no height, there can be no offset
    if (!viewHeight)
        return hasOffset;

    var topOffset = viewHeight.top;

    if (topOffset + Toolkit.height(namespace) >= heightOffset && topOffset <= totalHeight)
        hasOffset = true;

    return hasOffset
}

/**
 * Our event name
 *
 * @type {string}
 */
export var responsiveEvent = "global.responsiveViewChanged";

/**
 * Calculate the current viewport (expensive)
 *
 * @returns {string}
 */
export function calculateViewport() {
    // Initialize variables
    var trackingElem = document.createElement("span"),
        previousViewport = viewport;

    trackingElem.className = "responsive-tracking";
    document.body.appendChild(trackingElem);

    if (createTrackingElement(trackingElem, "responsive-tracking--visible-on-large-desktop")) {
        viewport = viewports.DESKTOP_LARGE;
    } else if (createTrackingElement(trackingElem, "responsive-tracking--visible-on-desktop")) {
        viewport = viewports.DESKTOP;
    } else if (createTrackingElement(trackingElem, "responsive-tracking--visible-on-tablet")) {
        viewport = viewports.TABLET;
    } else {
        viewport = viewports.MOBILE;
    }

    document.body.removeChild(trackingElem);

    if (void 0 !== previousViewport && previousViewport !== viewport) {
        // Event data
        var publishData = {
            viewport: viewport,
            previousViewport: previousViewport
        };

        // Trigger events
        Events.publish(Events, responsiveEvent, publishData);
    }

    return viewport;
}

/**
 * Create the viewport tracking element
 *
 * @param context
 * @param className
 */
function createTrackingElement(context, className) {
    var spanElem = document.createElement("span");

    spanElem.className = className;
    context.appendChild(spanElem);

    return spanElem.offsetWidth > 0 && spanElem.offsetHeight > 0
}

/**
 * Get a viewport without the danger of over-calculating
 *
 * @returns {*|string}
 */
export function getViewport() {
    return viewport || calculateViewport()
}