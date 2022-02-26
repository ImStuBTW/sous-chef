module.exports = function(io, clientSocket) {
    let recipeInfo = {title: '', subtitle: '', url: '', hidden: true},
        drinkInfo = {brewery: '', beer: '', url: '', hidden: true};
    
    clientSocket.on('recipe-chat', () => {
        if (recipeInfo.title) {
            let msg = recipeInfo.title;
            // subtitle?
            if (recipeInfo.subtitle) { msg += ` ${recipeInfo.subtitle}`; }
            // url?
            if (recipeInfo.url) { msg += ` - ${recipeInfo.url}`; }

            io.emit('twitch-chatpost', {message: msg});
        }
    });      

    clientSocket.on('drink-chat', () => {
        if (drinkInfo.beer) {
            let msg = drinkInfo.beer;
            // brewery?
            if (drinkInfo.brewery) { msg += ` (by ${drinkInfo.brewery})`; }
            // url?
            if (drinkInfo.url) { msg += ` - ${drinkInfo.url}`; }

            io.emit('twitch-chatpost', {message: msg});
        }
    });      

    io.on('connection', (socket) => {
        // GET RECIPE
        // This message occurs when a recipe state is requested on the control panel.
        // Broadcast recipe details to all listeners.
        socket.on('recipe-fetch', function(fn) {
            console.log(`recipe.js | recipe-fetch | Sending recipe title '${recipeInfo.title}' and subtitle '${recipeInfo.subtitle}', hidden? ${recipeInfo.hidden}`);
            fn(recipeInfo);
        });

        // UPDATE RECIPE
        // This message occurs when a new recipe is set on the control page.
        // Set locally, then broadcast recipe details to all listeners.
        socket.on('recipe-update', function(msg) {
            console.log(`recipe.js | recipe-update | Setting recipe title '${msg.title}' and subtitle '${msg.subtitle}', hidden? ${msg.hidden}`);
            recipeInfo = msg;
            io.emit('recipe-info', msg);
        });

        // GET DRINK
        // This message occurs when a drink state is requested on the control panel.
        // Broadcast drink details to all listeners.
        socket.on('drink-fetch', function(fn) {
            console.log(`recipe.js | drink-fetch | Sending drink brewery '${drinkInfo.brewery}' and beer '${drinkInfo.beer}', hidden? ${drinkInfo.hidden}`);
            fn(drinkInfo);
        });

        // UPDATE DRINK
        // This message occurs when a new drink is set on the control page.
        // Set locally, then broadcast drink details to all listeners.
        socket.on('drink-update', function(msg) {
            console.log(`recipe.js | drink-update | Setting drink brewery '${msg.brewery}' and beer '${msg.beer}', hidden? ${msg.hidden}`);
            drinkInfo = msg;
            io.emit('drink-info', msg);
        });
    });
};