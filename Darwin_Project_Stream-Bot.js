const Discord = require("discord.js")
const bot = new Discord.Client({ autoReconnect: true })
const config = require("./config.js").config
let prefix = config.prefix;

bot.login(config.BOT_TOKEN)

bot.on("ready", () => {
    console.log(`${bot.user.tag} is Ready`);
    bot.user.setActivity("Started and ready").then(() => {
        setTimeout(() => {
            Activity1();
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

bot.on("message", async message => {
    //#region Variables
    var Mess = message;
    var Mess_Channel = message.channel;
    var Mess_Member = message.member;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const args_test = message.content.split(" ").slice(1);
    //#endregion

    //#region Permission
    const BOT_MANAGE_CHANNELSPerm = message.guild.channels.find("id", message.channel.id).permissionsFor(message.guild.me).has("MANAGE_CHANNELS") && message.channel.type === 'text'

    //#endregion


    if (!message.guild) return;
    if (message.author.bot) return;

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

bot.on("presenceUpdate", async (oldmember, newmember) => {
    let streamer_role = "439952334953381919";

    if (newmember.presence.game == null || oldmember.presence.game == null) {
        console.log(`${newmember.user.tag} - game is null`);
        newmember.guild.fetchMember(newmember)
            .then(user => {
                if (user.roles.exists("id", streamer_role)) {
                    user.removeRole(streamer_role)
                }
            })

        return;

    } else if (oldmember.presence.game && !newmember.presence.game) {
        console.log(`${newmember.user.tag} - Ne joue plus`);
        newmember.guild.fetchMember(newmember)
            .then(user => {
                if (user.roles.find("id", streamer_role)) {
                    console.log("He has the streamer role");

                    newmember.guild.fetchMember(newmember)
                        .then(user => {
                            if (user.roles.exists("id", streamer_role)) {
                                user.removeRole(streamer_role)
                            }
                        })
                        
                } else console.log("he dont have streamer role");

                //console.log(user.roles);

            })

    } else if (newmember.presence.game.streaming) {
        console.log(`${newmember.user.tag} - Stream`);


        if (newmember.presence.game.name == `Darwin Project`) {
            console.log(`${newmember.user.tag} - Stream sur DP`);
            console.log(`J'ajoute donc le role streamer`);

            newmember.guild.fetchMember(newmember)
                .then(user => {
                    if (user.roles.find("id", streamer_role)) {
                        console.log("He already has the streamer role");

                    } else {
                        console.log("he dont have streamer role");
                        user.addRole(streamer_role)
                    }

                    console.log(user.roles.array());

                    /*user.removeRole(439952334953381919)
                        .catch(err => {
                            console.log(err);
                        })
                    */
                })
        }

    } else if (oldmember.presence.game.streaming && !newmember.presence.game.streaming) {
        //Si avant il streamait et que maintenant il ne stream plus alors:

        console.log(`${newmember.user.tag} - Ne stream plus !`);

        newmember.guild.fetchMember(newmember)
            .then(user => {
                if (user.roles.find("id", streamer_role)) {
                    user.removeRole(streamer_role);
                }
            })


    }
})