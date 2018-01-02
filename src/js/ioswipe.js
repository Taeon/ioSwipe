/**
 * ioSwipe
 *
 * Instant support for swipe events
 *
 * Based on code from //https://codepen.io/ganmahmud/pen/RaoKZa
 *
 * See https://github.com/Taeon/ioSwipe for docs
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Patrick Fox
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root.ioswipe = factory();
    }
}(
    this,
    function () {

        var Swipe = function( el, dir ){
            if( dir == 'none' ){
                return;
            }
            var data = {direction: dir};
            if (window.CustomEvent) {
                // Generic swipe event
                var swipe_event = new CustomEvent('swipe', {detail: data});
                // Swipe direction
                var swipe_dir_event = new CustomEvent('swipe' + dir, {detail: data});
            } else {
                // Generic swipe event
                var swipe_event = document.createEvent('CustomEvent');
                swipe_event.initCustomEvent('swipe', true, true, data);
                // Swipe direction
                var swipe_dir_event = document.createEvent('CustomEvent');
                swipe_dir_event.initCustomEvent('swipe' + dir, true, true, data);
            }

            el.dispatchEvent(swipe_event);
            el.dispatchEvent(swipe_dir_event);
        }

        var EnableSwipe = function( el, options ){

            var o = {
                threshold: 150, //required min distance traveled to be considered swipe
                restraint: 100, // maximum distance allowed at the same time in perpendicular direction
                allowedTime: 300, // maximum time allowed to travel that distance
                lock_scroll: false
            };
            if( typeof options != 'undefined' ){
                for( var index in options ){
                    o[ index ] = options[ index ];
                }
            }

            var touchsurface = el,
            swipedir,
            startX,
            startY,
            distX,
            distY,
            threshold = o.threshold,
            restraint = o.restraint,
            allowedTime = o.allowedTime,
            elapsedTime,
            startTime

            touchsurface.addEventListener('touchstart', function(e){
                var touchobj = e.changedTouches[0]
                swipedir = 'none'
                dist = 0
                startX = touchobj.pageX
                startY = touchobj.pageY
                startTime = new Date().getTime() // record time when finger first makes contact with surface
                if( o.lock_scroll ){
                    e.preventDefault()
                }
            }, false)

            touchsurface.addEventListener('touchmove', function(e){
                if( o.lock_scroll ){
                    e.preventDefault()
                }
            }, false)

            touchsurface.addEventListener('touchend', function(e){
                var touchobj = e.changedTouches[0]
                distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
                distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
                elapsedTime = new Date().getTime() - startTime // get time elapsed
                if (elapsedTime <= allowedTime){ // first condition for swipe met
                    if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                        swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
                    }
                    else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                        swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
                    }
                }
                Swipe(el,swipedir);
                if( o.lock_scroll ){
                    e.preventDefault()
                }
            }, false)
        }

        var ioswipe = function( el, options ){
            switch( typeof el ){
                case 'object':{
                    if( typeof el.length != 'number' ){
                        // A single element e.g. result of document.querySelector()
                        // or document.getElementById())
                        el = [ el ];
                    }
                    break;
                }
                case 'string':{
                    // A selector string
                    el = document.querySelectorAll( el );
                    break;
                }
            }
            for( var i = 0; i < el.length; i++ ){
                EnableSwipe( el[ i ], options );
            }
        }
        return ioswipe;
    }
)
);
