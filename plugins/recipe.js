module.exports = function(io) {
    let recipeInfo = {title: '', subtitle: '', hidden: true},
        drinkInfo = {brewery: '', beer: '', hidden: true};
    
    io.on('connection', (socket) => {
        // GET RECIPE
        // This message occurs when a recipe state is requested on the control panel.
        // Broadcast recipe details to all listeners.
        socket.on('recipe-fetch', function(fn) {
            console.log(`Sending recipe title '${recipeInfo.title}' and subtitle '${recipeInfo.subtitle}', hidden? ${recipeInfo.hidden}`);
            fn(recipeInfo);
        });

        // UPDATE RECIPE
        // This message occurs when a new recipe is set on the control page.
        // Set locally, then broadcast recipe details to all listeners.
        socket.on('recipe-update', function(msg) {
            console.log(`Setting recipe title '${msg.title}' and subtitle '${msg.subtitle}', hidden? ${msg.hidden}`);
            recipeInfo = msg;
            io.emit('recipe-info', msg);
        });

        // GET DRINK
        // This message occurs when a drink state is requested on the control panel.
        // Broadcast drink details to all listeners.
        socket.on('drink-fetch', function(fn) {
            console.log(`Sending drink brewery '${drinkInfo.brewery}' and beer '${drinkInfo.beer}', hidden? ${drinkInfo.hidden}`);
            fn(drinkInfo);
        });

        // UPDATE DRINK
        // This message occurs when a new drink is set on the control page.
        // Set locally, then broadcast drink details to all listeners.
        socket.on('drink-update', function(msg) {
            console.log(`Setting drink brewery '${msg.brewery}' and beer '${msg.beer}', hidden? ${msg.hidden}`);
            drinkInfo = msg;
            io.emit('drink-info', msg);
        });
    });
};