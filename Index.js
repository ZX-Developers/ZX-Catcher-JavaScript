const { Client } = require("replit-test123");
const client = new Client({ checkUpdate: false });
const config = require('./config.json');
const fetch = require("node-fetch");

const token = config.token;
const key = config.key;

let stats = {
  caught: 0,
  fled: 0
};

const apiEndpoint = "http://5.161.72.213:5663/pokemon";  // Replace with your API host and port

client
  .on("ready", () => {
    console.log("Connected as " + client.user.username);
  })
  .on("messageCreate", async (message) => {
    try {
      if (!config.guilds.includes(message.guild.id)) return;

      if (message.author.id == "716390085896962058") {
        if (message.content.includes("Congratulations")) stats.caught++;
        if (!message.embeds || message.embeds.length === 0 || !message.embeds[0].title.includes("wild pokÃ©mon has appeared!")) return;

        // Replace with your actual API key
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 'key': key, 'image_url': message.embeds[0].image.url })
        });

        const data = await response.json();
        let name = data.pokemon[0];
                console.log(name);
        await message.channel.send(`<@716390085896962058> c ${name}`).then(x => console.log(x, `nig`));
        console.log(`Sent`);
        if (message.embeds[0].title.includes("fled")) stats.fled++;
      } else {
        if (message.content.toLowerCase().startsWith("-stats")) {
          let den = stats.caught + stats.fled == 0 ? 1 : stats.caught + stats.fled;
          message.channel.send("\n" + `Total Caught: ${stats.caught} \nTotal Missed: ${stats.fled}\n\nAccuracy: ${((stats.caught / (den)) * 100).toFixed(3)}%` + "");
        } else if (message.content.toLowerCase().startsWith("-say")) {
          // Extract the message content after the "-say" prefix
          const sayMessage = message.content.slice("-say".length).trim();
          // Send the extracted message back to the channel
          message.channel.send(sayMessage);
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

client.login(token);
