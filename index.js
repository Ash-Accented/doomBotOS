require('dotenv').config(); //Load our environmental variables from .env, using the dotenv package installed with npm
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js'); //importing Rest and Routes, from discord.js (means REST and Routes comes from discord.js)
if (typeof globalThis.setTimeout === 'function'){
  const originalSetTimeout = globalThis.setTimeout;
  globalThis.setTimeout = function (callback, delay, ...args){
    const safeDelay = Math.max(0, delay);
    return originalSetTimeout(callback, safeDelay, ...args);
  };
}
const deployCommands = async () => {
  //Deploy Command Logic
  try {
    const commands = [];
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    for (const file of commandFiles)
    {
      const command = require(`./commands/${file}`);
      if ('data' in command && 'execute' in command){
        commands.push(command.data.toJSON());
      } else {
        console.log(`WARNING: The command at ${file} is missing a required 'data' or 'execute' property`);
      }
    }
  
  
    const rest = new REST().setToken(process.env.BOT_TOKEN);
    console.log(`Started refreshing ${commands.length} application slash commands globally.`);

    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      {body : commands},
    );
    console.log("Successfully reloaded all commands");
  } catch (error) {
      console.error(error);
  }
}

const { //The necessary classes are imported first 
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  ActivityType,
  PresenceUpdateStatus,
  Events
} = require('discord.js'); //We are bringing all those constants from discord.js

const client = new Client({ 
  intents: [ //Then the client options object requires an intents property to specify which events your bot will receive from discord
    GatewayIntentBits.Guilds, //Required for the bot to function in servers (guilds)
    GatewayIntentBits.GuildMessages, //Required to receive messages in the guild
    GatewayIntentBits.MessageContent, //Required to read the content of the messages
    GatewayIntentBits.GuildMembers, //enum member
    GatewayIntentBits.GuildVoiceStates    //To allow for the mp3 to play in the channel of choice 
  ],
  //Partial data is only ever guaranteed to contain an ID
  partials: [ //Partial Structures were introduced to the library in version 12 and are optionally received whenever there is insufficient data to emit the client event with a fully intact discord.js structure.
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember
  ]
});

client.commands = new Collection();

//const fs = require('fs'); //Included by default, put it at top
const commandsPath = path.join(__dirname, 'commands'); //Paths to join, Join all arguments together and normalize the reuslting path, we're specifying the commands path will be a directory called commands
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); //Reads the directory commandsPath, and looking at the commands that end with .js

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if('data' in command && 'execute' in command) //If it has the data and execute property, then we can safely execute it, and set the command name to 'command'
  {
    client.commands.set(command.data.name, command);

  } else {
    console.log(`The Command ${filePath} is missing a required "data" or "execute" property.`); //Filtering anything that we don't want 
  }
}
client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  
  if (!command) return;
	//if (interaction.commandName === 'pork') {
	//	await interaction.deferReply(); 
		// you can do things that take time here (database queries, api requests, ...) that you need for the initial response
		// you can take up to 15 minutes, then the interaction token becomes invalid!
	//	await interaction.editReply('Pong!'); 
//	}

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true});
    }
    else {
      await interaction.reply({ content: 'There was an error while executing this command', ephemeral: true});
    }
  }
});
client.once(Events.ClientReady, async () => {
    console.log(`Ready! Logged in as ${client.user.tag}`); //Show the bot's name in the console
    //Deploy Commands
    await deployCommands();
    console.log("Commands deployed globally.");

    const statusType = process.env.BOT_STATUS || 'online'; 
    const activityType = process.env.ACTIVITY_TYPE || 'PLAYING';
    const activityName = process.env.ACTIVITY_NAME || 'Discord';

    // Activity types do require enums, instead of just strings, 
    const activityTypeMap = {
      'PLAYING': ActivityType.Playing,
      'WATCHING': ActivityType.Watching,
      'LISTENING': ActivityType.Listening,
      'STREAMING': ActivityType.Streaming,
      'COMPETING': ActivityType.Competing
    };
    
    const statusMap = {
      'online': PresenceUpdateStatus.Online,
      'idle': PresenceUpdateStatus.Idle,
      'dnd': PresenceUpdateStatus.DoNotDisturb,
      'invisible': PresenceUpdateStatus.Invisible
    };
    
    client.user.setPresence ({
      status: statusMap[statusType],
      activities: [{
        name: activityName,
        type: activityTypeMap[activityType]
      }]
    });

    console.log(`Bot status set to ${statusType}`);
    console.log(`Activity set to: ${activityType} ${activityName}`);
});
//COMMANDS HERE



client.login(process.env.BOT_TOKEN);
