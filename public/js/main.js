(function() {
	var EventUtil = {
        /**
         *  crossbrowser getUserMedia funtion for Opera & Chrome
         *	@return {void}
         */  
		getUserMedia: function(opts, success, fail) {
			if (navigator.getUserMedia) {
				navigator.getUserMedia(opts, success, fail);
			} else if (navigator.webkitGetUserMedia) {
				navigator.webkitGetUserMedia(opts, success, fail);
			} else {
				alert('Your browser is NOT supported!');
			}
		}, 

        /**
         *  crossbrowser shim for adding events.
         *	@return {void}
         */
		addListener: function(node, evnt, callback) {
			if (document.addEventListener) {
				node.addEventListener(evnt, callback, false);
			} else if (document.attachEvent) {
				node.attachEvent('on' + evnt, callback);
			} else {
				node['on' + evnt] = callback;
			}
		},

	    /**
	     *  Creates a HTML Element
	     *
	     *  @param {Object} obj - An object with element properties.
	     *  @param {Function} callback - A call back function.
	     *	@return {void}
	     */
		createElement: function ( obj, callback ) {
	        // if there's NO name prop, default it to an image
	        var name = obj.name || 'img',
	            elem = document.createElement(name);

	        if (obj.properties) {
	            var props = Object.keys(obj.properties);

	            forEach(props, function (prop) {
	                elem[prop] = obj.properties[prop];
	            })
	        }

	        // if there's NO appendTo prop, append it to document.body
	        var appendTo = obj.appendTo || document.body;
	        appendTo.appendChild(elem);

	        if (typeof callback == 'function') callback(elem);
	    }
	}, state = {
		on: 1,
		off: 0
	}, currentState = state.off;


	/**
     *  cross-browser forEach Shim.
     *  
     *  @param {Array} array - An array object
     *  @param {Function} callback - A callback to work on the array
     *	@return {Void}
     */
    function forEach (array, callback) {
        for (var i = 0; i < array.length; i++) {
            callback(array[i], i);
        }
    }

	/**
     *  An Event Handler for ALL events.
     *
     *  @param {Object} event - The DOM event Object
     *	@return {Void}
     */
	function handler (event) {
		var event = event || window.event;
		var target = event.target || event.srcElement;

		switch(target.id) {
			case 'camera': {
				camera();
			}
			break;

			case 'capture': {
				captureImage();
			}
			break;

			default: {
				console.log(target.id + ' was clicked.');
			}
		}
	}

	/**
	 *	Turns on the webcam/camera on or off and streams it to the video tag.
	 *	@return {void}
	 */
	function camera() {
		var video = document.getElementById('liveVideo'),
			cameraBtn = document.getElementById('camera');

		if (currentState === state.off ) {
			currentState = state.on;
			cameraBtn.value = 'Stop Camera';
		
			EventUtil.getUserMedia({'video': true}, function(stream){
				var url = (navigator.getUserMedia) ? stream : window.webkitURL.createObjectURL(stream);

				video.src = url;
			}, function() {
					alert('There is an error in Accessing the media.');
			});
		} else if (currentState === state.on) {
			currentState = state.off;
			cameraBtn.value = 'Start Camera';

			video.pause();
			video.src = '';
		}
	}

	/**
	 *	Takes snapshots of the video element, and draws it on the canvas.
	 *	@return {void}
	 */
	function captureImage() {
		var captureBtn = document.getElementById('capture'),
			video = document.getElementById('liveVideo'),
			picture = document.getElementById('picture'),
			canvas = picture.getContext('2d');

		if (video.src != '') {
			canvas.width = video.width;
			canvas.height = video.height;
			canvas.drawImage(video, 0, 0);

			addImageThumbnail(picture.toDataURL('image/jpeg'));			
		} else {
			alert("C'mon, How can you take a photo, if the camera is not On?");
		}
	}

	/**
	 *	Creates a new 'div' element that contains an image and it's time of creation, and appends them to the '#thumbnails' div.
	 *
	 *	@param {String} src - The image's src.
	 *	@return {Void}
	 */
	function addImageThumbnail(src) {
		EventUtil.createElement({name: 'div', appendTo: document.getElementById('thumbnails')}, function(div) {
		  	var d = new Date();

			div.innerHTML = '<label><img src="' + src + '"/><br/>Created at: ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '</label>';
		})
	}

	EventUtil.addListener(document, 'click', handler);
})(this)