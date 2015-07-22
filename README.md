# *Ex-* Script

This is a Chrome extension to automate YouTube playback with a scripting language.

![alt tag](https://raw.githubusercontent.com/dantony/exscript/master/icons/icon128.png)

## Intro
*Ex-* Script is a scripting language to specify loop playback for HTML5 video tags. The Chrome extension enables the user to write and execute scripts for YouTube videos. Practicing with a metronome is boring. For this reason, the language facilitates practicing different sections of a video according to the loops specified in the script. [Young Guitar Magazine](http://youngguitar.jp/) inspired the development and naming of this extension. They provide demonstration videos with breakdowns of solos and phrases at various speeds. Each exercise begins with an *Ex-*# label.

## Chrome Extension
The Chrome extension popup contains four sections: script, name, editor, and controls.
  1. The script dropdown selects previously saved scripts.
  2. The name text enables the user to name or rename a script.
  3. The editor is a textarea to define the script.
  4. The controls enable the user to run, save, cancel, or delete a script and play/pause the video.

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
* Use the loop parameter specify the number of times to repeat the time range.
* Format = write a number followed by an X.
* Note: the loop repeat number defaults to 1.

Speed:
* Use the speed parameter to specify the playback rate.
* Format: write a number followed by a % symbol.
* Note: the default playback rate defaults to 100%.
* Note: playback rate seems to work in the range 50%-400%.

Other:
* To include comments, prefix with a # symbol.
* To include multiple loops on a single line, use a semicolon.

## Example
Script:  
  <code>00:50-01:10 5x 75%</code>  
  <code>02:00-03:30 10x 100%</code>  

Translation:  
  Play from 00:50 to 01:10 5 times at 75% speed.  
  Then skip to and play from 02:00 and 3:30 10 times at 100% speed.  
  Then continue playing at normal speed for the rest of the video.  


