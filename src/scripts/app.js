function load (file, callback) {
    const xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest.open('GET', file);
    xmlHttpRequest.responseType = 'arraybuffer';

    xmlHttpRequest.onerror = function (event) {
        callback(event);
    };
    xmlHttpRequest.onload = function () {
        callback(null, xmlHttpRequest.response);
    };

    xmlHttpRequest.send();
}

function log (id, message) {
    const cnsl = document.querySelector('#' + id + ' .console');
    const item = document.createElement('li');

    item.textContent = message;

    cnsl.appendChild(item);
}

function setup (mimeType, codec, file, mimeTypeWithCodec) {
    const id = mimeType.split(/\//)[1] + '-' + codec.toLowerCase();

    if (MediaSource.isTypeSupported(mimeTypeWithCodec)) {
        log(id, 'Audio of type "' + mimeType + '" with ' + codec + ' as a codec seems to be supported.');
    } else {
        log(id, 'Audio of type "' + mimeType + '" with ' + codec + ' as a codec seems to be NOT supported.');
    }

    const audioElement = document.querySelector('#' + id + ' audio');
    const mediaSource = new MediaSource();

    audioElement.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener('error', function () {
        log(id, 'An "error" event was fired by the MediaSource.');
    });
    mediaSource.addEventListener('sourceclose', function () {
        log(id, 'The "sourceclose" event of the MediaSource was fired.');
    });
    mediaSource.addEventListener('sourceended', function () {
        log(id, 'The "sourceended" event of the MediaSource was fired.');
    });
    mediaSource.addEventListener('sourceopen', function () {
        log(id, 'The "sourceopen" event of the MediaSource was fired.');

        try {
            const sourceBuffer = mediaSource.addSourceBuffer(mimeTypeWithCodec);

            sourceBuffer.addEventListener('abort', function () {
                log(id, 'The "abort" event of the SourceBuffer was fired.');
            });
            sourceBuffer.addEventListener('error', function () {
                log(id, 'The "error" event of the SourceBuffer was fired.');
            });
            sourceBuffer.addEventListener('updateend', function () {
                log(id, 'The "updateend" event of the SourceBuffer was fired.');
                log(id, 'Calling "endOfStream()" on the MediaSource.');

                mediaSource.endOfStream();
            });

            load(file, function (err, buffer) {
                if (err === null) {
                    log(id, 'The buffer of the file "' + file + '" was loaded successfully.');

                    sourceBuffer.appendBuffer(buffer);
                } else {
                    log(id, 'The file "' + file + '" could not be loaded.');
                }
            });
        } catch (err) {
            log(id, 'Creating a SourceBuffer of type "' + mimeType + '" with ' + codec + ' as a codec failed. The original error was logged to the console.');

            throw err;
        }
    });
}

setup('audio/mpeg', 'MP3', 'assets/audio.mp3', 'audio/mpeg');

setup('audio/mp2t', 'MP3', 'assets/audio.ts', 'audio/mp2t');

setup('audio/mp4', 'AAC', 'assets/audio-aac.mp4', 'audio/mp4; codecs="mp4a.40.2"');

setup('audio/mp4', 'MP3', 'assets/audio-mp3.mp4', 'audio/mp4');

setup('audio/webm', 'Opus', 'assets/audio.webm', 'audio/webm; codecs="opus"');
