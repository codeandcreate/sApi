/**
 * a very simple logger, that logs message at the end of the html dom
 */
$s.extend({ 
    frontendLogger: {
        messageContainer: null,

        log: function(message)
        {
            if (this.messageContainer === null) {
                setTimeout(function() {
                    $s.frontendLogger.log(message);
                }, 100);
            } else {
                this.messageContainer.insertAdjacentHTML('beforeend', message + "\n");
            }
        },

        init: function()
        {
            this.messageContainer = document.createElement("PRE");
            document.body.appendChild(this.messageContainer);
        }
    }
});