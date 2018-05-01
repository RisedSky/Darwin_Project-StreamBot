const Discord = require("discord.js")
const bot = new Discord.Client({ autoReconnect: true })
const config = require("./config.js").config
let prefix = config.prefix;

//Mon serv
//let DP_FR_Server = "426157164466405377";
//let streamer_role = "440172608969900035";

let DP_FR_Server = "379235271478214657";
let streamer_role = "439952334953381919";

bot.login(config.BOT_TOKEN)

bot.on("ready", () => {
    console.log(`${bot.user.tag} is Ready`);
    bot.user.setActivity("Started and ready").then(() => {
        setTimeout(() => {
            Activity1();
            var looping_thing = setInterval(loop_verification, 10 * 1000)

        }, 30 * 1000);
    })

    bot.user.setStatus("online")
})

bot.on("error", err => {
    console.log(err);
})

function Activity1() {
    bot.user.setActivity("Created by RisedSky#1250")
    setTimeout(() => {
        Activity1()
    }, 60 * 1000);
}

function loop_verification() {

    bot.guilds.forEach(g => {
        if (g.id == DP_FR_Server) {

            var memb_arr = g.members.array()
            memb_arr.forEach(user => {

                //console.log(user.user.username);

                if (!user.presence.game) {
                    if (user.roles.exists("id", streamer_role)) user.removeRole(streamer_role);
                    return;
                }

                if (!user.presence.game.streaming) return user.removeRole(streamer_role);

                if (user.presence.game.streaming) {
                    if(!user.presence.game.name == "Darwin Project") return;
                    if (!user.roles.exists("id", streamer_role)) {
                        return user.addRole(streamer_role, "Automatic role")
                    }
                }
            })
        }
    })


}

bot.on("message", async message => {
    
    //#region Variables
    var Mess = message;
    var Mess_Channel = message.channel;
    var Mess_Member = message.member;
    var Mess_Guild = message.guild;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const args_test = message.content.split(" ").slice(1);
    //#endregion

    //#region Permission
    //const BOT_MANAGE_CHANNELSPerm = message.guild.channels.find("id", message.channel.id).permissionsFor(message.guild.me).has("MANAGE_CHANNELS") && message.channel.type === 'text'

    //#endregion


    //console.log(`'${message.content}' from ${message.member.user.tag}`);


    if (!Mess_Guild) return;
    if (message.author.bot) return;

    /*
    var memb_arr = Mess_Guild.members.array();

    //console.log(`Sur le serv ${Mess_Guild.name}`);
    if (Mess_Guild.id == DP_FR_Server) {
        //console.log("Bien sur le serv DP_FR");

        memb_arr.forEach(user => {

            //console.log(user.user.username);

            if (!user.presence.game) {
                if (user.roles.exists("id", streamer_role)) user.removeRole(streamer_role);
                return;
            }

            if (!user.presence.game.streaming) return user.removeRole(streamer_role);

            if (user.presence.game.streaming) {
                if (!user.roles.exists("id", streamer_role)) {
                    return user.addRole(streamer_role, "Automatic role")
                }
            }
        })
    }
    */

    if (message.content.startsWith(String(`${prefix}eval`).toLowerCase())) {

        function clean(text) {
            if (typeof (text) === "string")
                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }

        let owner_list = "145632403946209280 - 142646071192059904";
        if (!String(owner_list).includes(message.author.id)) return;
        try {
            const code = args_test.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            message.author.createDM().then(() => {
                message.author.send(clean(evaled), { code: "xl", split: true });
            })
        } catch (err) {
            message.author.createDM().then(() => {
                message.author.send(clean(evaled), { code: "xl", split: true });
            })
        }
    }
})
