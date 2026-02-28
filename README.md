# doomBotOS
#### An earnest attempt at programming a Discord bot, capable of running an emulated version of Doom live in a text-channel/VC channel.[^1]
[^1]: PS: Also does other things I require for utility, like simple music commands for personal reasons.





## CHECKLIST:
- [x] **Make own version of remoteDiscordShell https://github.com/EnriqueMoran/remoteDiscordShell, allowing me to run commands from a discord channel => Bot => Host Machine**
  - ###### Made /bash_command capable of running commands and returning the stdout
  - <img width="936" height="434" alt="image" src="https://github.com/user-attachments/assets/69144c5b-1091-4f78-8b8a-8200291b471c" />


- [x] **Run the Discord bot from a Docker container that can run Doom on an emulator.**
  - <img width="1232" height="604" alt="image" src="https://github.com/user-attachments/assets/a5d2725c-9e27-461c-a5f1-a6c6fbcb64d8" />
  - <img width="519" height="351" alt="image" src="https://github.com/user-attachments/assets/6315c451-86d9-4de7-86d2-a4a7a4513bcf" />

  
- [ ] **\(Optional) Make a slash command-driven 'text editor' for the Discord bot that allows for file editing from a Discord channel**
  - ###### At the present moment, nano, vi, and other text editors don't work from the channel. My idea was to use shell commands that the virtual machine can execute, along with Discord slash commands that map to bash commands, for a bare-bones, makeshift text editor capable of applying changes to files via a Discord channel.
    - ###### This wouldn't be necessary to run Doom on a Discord bot; however, being able to operate your Docker container from a Discord channel without ANY external assistance would be amusing, despite the impracticality.



## USAGE
```
/bash_command [string_args]
/ping
/play_local_directory [local_directory_string]
/play_local_audio_file [local_file_path_string]
```

###COMMANDS

/bash_command *[string_args]* 
> <sub>//Executes a bash_command on a virtual machine in docker running alpine:v3.23 (where the bot currently runs), was thinking to modify this to execute the command from the host machine, and return the standard output of the virtual machine.</sub>



/ping
> <sub>//Delivers the messaging ping of the bot</sub>



### ***(REQUIRES HOSTING A UNIQUE BOT, RUNNING CODE CLONED FROM MY GITHUB, ON YOUR MACHINE)***
/play_local_directory *[local_directory_string]*
> <sub>//Plays the MP3, wav, or flac files in a local directory of choice, as if it were a playlist.</sub>

/play_local_audio_file *[local_file_path_string]*
> <sub>//Plays an MP3, wav, or flac file in a local directory of choice.</sub>










