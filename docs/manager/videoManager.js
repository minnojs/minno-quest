// The Video manager is a basic example of how to display videos.
// It is heavily commented so that you can follow everything that goes on.
// After reading the documentation feel free to download the file and modify it according to your needs.
//
// ### Opening section
//
// The opening section of each script is always more or less the same.
// We create the wrapper for the script (`define`), and create a new instance of a manager.
define(['managerAPI'], function(Manager){

  var API = new Manager();

  // ### The sequence
  // The most important part of every manager script is the sequence.
  // This is where you tell it how to interact with the participants.
  API.addSequence([

    // #### Show Video
    // This message simply displays a video
    // You can use [this site](http://v4e.thewikies.com/) to create appropriate templates
    // Note that the video url is set within the data attributes
    {
      type: 'message',

      data: {
        // The video url (as mp4!)
        videoUrl: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
        // An image to use as a poster until the video plays
        imageUrl: 'http://sandbox.thewikies.com/vfe-generator/images/big-buck-bunny_poster.jpg'
      },

      // We create the video template itself
      template: [
        '<div class="text-center">',
        ' <video controls="controls" autoplay="autoplay" poster="<%= tasksData.imageUrl %>" width="640" height="360" style="margin:auto">',
        '   <source src="<%= tasksData.videoUrl %>" type="video/mp4"/>',
        '   <object type="application/x-shockwave-flash" data="http://flashfox.googlecode.com/svn/trunk/flashfox.swf" width="640" height="360">',
        '     <param name="movie" value="http://flashfox.googlecode.com/svn/trunk/flashfox.swf" />',
        '     <param name="allowFullScreen" value="true" />',
        '     <param name="wmode" value="transparent" />',
        '     <param name="flashVars" value="autoplay=true&controls=true&poster=<%= tasksData.imageUrl %>&src=<%= tasksData.videoUrl %>" />',
        '   </object>',
        ' </video>',
        '</div>',
        '<div class="text-center proceed" style="margin: 30px auto 10px;">',
        ' <button pi-message-done type="button" class="btn btn-primary">Click Here to Proceed</button>',
        '</div>'
      ].join('\n')
    },


    // ### Show video and defer proceed
    // This message is identical to the previous one,
    // only now we use a trick to defer the presentation of the proceed button until the video completes
    {
      type: 'message',

      data: {
        // The video url (as mp4!)
        videoUrl: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
        // An image to use as a poster until the video plays
        imageUrl: 'http://sandbox.thewikies.com/vfe-generator/images/big-buck-bunny_poster.jpg'
      },

      // We create the video template itself
      template: [
        '<div class="text-center">',
        ' <video controls="controls" autoplay="autoplay" poster="<%= tasksData.imageUrl %>" width="640" height="360" style="margin:auto">',
        '   <source src="<%= tasksData.videoUrl %>" type="video/mp4"/>',
        '   <object type="application/x-shockwave-flash" data="http://flashfox.googlecode.com/svn/trunk/flashfox.swf" width="640" height="360">',
        '     <param name="movie" value="http://flashfox.googlecode.com/svn/trunk/flashfox.swf" />',
        '     <param name="allowFullScreen" value="true" />',
        '     <param name="wmode" value="transparent" />',
        '     <param name="flashVars" value="autoplay=true&controls=true&poster=<%= tasksData.imageUrl %>&src=<%= tasksData.videoUrl %>" />',
        '   </object>',
        ' </video>',
        '</div>',
        '<div class="text-center proceed" style="margin: 30px auto 10px;">',
        ' <button pi-message-done type="button" class="btn btn-primary">Click Here to Proceed</button>',
        '</div>'
      ].join('\n'),


      // This is where the magic happens. as soon as the page is loaded
      // We hide The proceed button, and show it only after 60 seconds when the video is supposed to end.
      // (Note that in certain situations the button may be displayed before the video finishes playing. This is because the timing is absolute and not dependant on the video actually finishing)
      load: function(){
        var proceed = document.querySelectorAll('.proceed')[0];
        proceed.style.visibility = 'hidden';
        setTimeout(function(){
          proceed.style.visibility = '';
        }, 60 * 1000); // after 10 seconds
      }

    }


    // Now, we just close the sequence.
  ]);

  // ### Closing section
  //
  // And finally, we close the script.
  // Here again, all scripts look more or less the same.
  // We return the `script` and close the `define` wrapper.
  return API.script;
});







