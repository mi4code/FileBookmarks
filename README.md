# File Bookmaks
Save your web bookmarks as files with optional offline content.
<!-- Bookmarking tool by browser-beta project. -->

## File format
`*.htmlfb` file that is later converted to regular html.
```
<time>timestamp in %Y-%m-%d %H:%M:%S GMT±%"time offset in hours of the given time"</time>
<p>bookmark name - same as tab title</p>
<a>url link</a>
<img>data url of screenshot/image - best converted to webp with 60% quality</img> ~optional
<html>saved html of the page (must be one file and one line)</html> ~optional
<video>data url of video (from youtube/instagram/tiktok/html5/...) - best with reduced size (av1 codec)</video> ~optional
<file>filename:dataurl (the file may be compressed)</file> ~optional
```
<!-- 
 datetime (GMT=UTC; the time written is current time at your timezone - UTC time has to be calculated )  <https://stackoverflow.com/questions/31089749/how-do-you-set-a-strftime-with-javascript>
 favicon (probably not worth of the space occupied)
 [video base64](https://stackoverflow.com/questions/49641540/html5-video-source-with-base64)
 av1 encoding: ffmpeg -i *.mp4 -filter:v scale=-1:640,fps=20 -vcodec libsvtav1 -acodec libopus -b:v 200k -b:a 20k *.mkv 
 
 what about regular url file format? ~ *.urlfb 
-->

## Current implementation
browser extension in `/extension` (just rename the right manifest and you can use it) \
**tested browsers:**
 - Opera Desktop - ok
 - Firefox Desktop - ok
 - Kiwi Android - downloads txt file, cant paste clipboard image, impossible to open bookmark file
 - Firefox Android - cant download bookmark file, cant paste clipboard image, impossible to open bookmark file

## TODOs
 - [ ] make `file_bookmaks.js` js module, implement bookmark as class
 - [ ] video, html and binary offline content - or just universal `<content></content>` tag and mime type detection 
 - [ ] download content from youtube/instagram/tiktok (in case of videos will need external application for compression/encoding)
 - [ ] import/export to browser + settings page
 - [ ] rework format - more/less xml compatible, no combination of html and custom tags
 - [ ] consider full file compression (not that usefull when having filesystem compression)
