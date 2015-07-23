# *Ex-* Script

This is a Chrome extension to automate YouTube playback with a scripting language.

![icon128.png](https://raw.githubusercontent.com/dantony/exscript/master/icons/icon128.png)

## Intro
Practicing with a metronome is boring. For this reason, the language facilitates practicing different sections of a video according to the loops specified in a script. *Ex-* Script is a scripting language to specify loop playback for HTML5 video tags. The Chrome extension enables the user to write and execute scripts for YouTube videos.  

There are sites, apps, and extensions that allow the user to loop a portion of a YouTube video, or repeat one nonstop. The advantage of this extension is that it allows the user to stay within the YouTube site and loop multiple portions of a video automatically. This allows the user to focus on practicing their instrument at various speeds without having to manually restart the video at specific points.

[Young Guitar Magazine](http://youngguitar.jp/) inspired the development and naming of this extension. They provide demonstration videos with breakdowns of solos and phrases at various speeds. Each exercise begins with an *Ex-*# label. 

## Chrome Extension
The Chrome extension popup contains four sections: script, name, editor, and controls.
  1. The script dropdown selects previously saved scripts.
  2. The name text input enables the user to name or rename a script.
  3. The editor is a textarea for the user to define a script.
  4. The controls enable the user to run, cancel, save, or delete a script and play/pause the video.

![ex_extension.PNG](https://raw.githubusercontent.com/dantony/exscript/master/ex_extension.PNG)

## Features
* Loop (noncontiguous) sections of a video.
* Set the number of loops.
* Automatically play each specified loop.
* Specify playback rate for each loop.
* Save scripts for the current video.

## Language Syntax
There are three loop parameters: range, loops, and speed.

Range:
* Each line specifies a loop and must include the range.
* Format = HH:MM:SS-HH:MM:SS.
* Note: the user may omit HH: or HH:MM and only specify :SS for example.

Repeat:
* Use the loops parameter specify the number of times to repeat the time range.
* Format = write a number followed by an X.
* Note: the loop repeat number defaults to 1.

Speed:
* Use the speed parameter to specify the playback rate.
* Format = write a number followed by a % symbol.
* Note: the playback rate defaults to 100%.
* Note: playback rate seems to work in the range 50%-400%.

Other:
* To include comments, prefix with a # symbol.
* To include multiple loops on a single line, use a semicolon.
* The order of loops doesn't matter.
* The script parser simply ignores invalid lines, so there is no error reporting (for now)...

## Example
Script:  
  <code>3:17-3:40 2x 100%</code>  
  <code>3:40-3:50 4x 75%</code>  
  <code>4:08-4:20 2x 85%</code>  

Translation:  
  Play from 3:17 to 3:40 twice at normal speed.  
  Then, skip to and play from 3:40 to 3:50 four times at 75% speed. 
  Then, skip to and play from 4:08 to 4:20 twice at 85% speed.   
  Then, continue playing the video at normal speed.  

# Attribution
Chrome and YouTube are trademarks of Google Inc. Use of this trademark is subject to Google Permissions.
Young Guitar Magazine is Copyright (C) of SHINKO MUSIC ENTERTAINMENT.CO.,LTD.
