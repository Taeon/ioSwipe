# ioSwipe
Quickly add support for touchscreen swipe events to HTML/JavaScript.

## Usage

Include the code, then simply call ioSwipe and pass in the element(s) you want to emit swipe events. You can pass in a jQuery-style selector string*, a single HTML element, or a collection of elements (e.g. a jQuery collection or the result of a call to ```document.querySelectorAll()```):

```javascript
ioswipe( '#myElement' ); // Selector string
ioswipe( document.getElementById( 'myElement' ) ); // A single element
ioswipe( $( '#myElement' ) ); // A jQuery collection
ioswipe( document.querySelector( '#myElement' ) ); // A single element
ioswipe( document.querySelectorAll( '.my-element-class' ) ); // A collection of elements
```

\* in fact, internally it uses ```querySelectorAll``` so if you're using jQuery and are worried about any possible differences in behaviour, just pass in a jQuery collection instead.

Now you can listen for swipe events. Two events are emitted -- firstly, a generic swipe event (```swipe```) and a separate event for the direction of the swipe (```swipeleft```, ```swiperight```, ```swipeup```, ```swipedown```). So you can listen for any swipe, or just one or more specific directions:

```javascript
// Native event handling
document.getElementById( 'myElement' ).addEventListener(
    'swipe', // A swipe occurred
    function( event ){
        // The direction of the swipe is in the event detail object
        alert( 'Swipe direction: ' + event.detail.direction );
    }
);
// With jQuery
$( 'myElement' ).on( 'swipeleft', function(){alert( 'Left swipe occurred' )} );
```
