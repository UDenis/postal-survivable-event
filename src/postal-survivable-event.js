( function (root, factory) {
    /* istanbul ignore if  */
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["lodash", "postal"], function (_, postal) {
            return factory(_, postal, root);
        });
        /* istanbul ignore else */
    } else if (typeof module === "object" && module.exports) {
        // Node, or CommonJS-Like environments
        module.exports = function (postal) {
            return factory(require("lodash"), postal, this);
        };
    } else {
        // Browser globals
        root.postal = factory(root._, root.postal, root);
    }
}(this, function (_, postal, global, undefined) {

    var plugin = {
        store: {}
    }

    function saveEvent(e) {
        var channel = e.channel || postal.configuration.DEFAULT_CHANNEL;
        var topic = e.topic;

        plugin.store[channel] = plugin.store[channel] || {};
        plugin.store[channel][topic] = e;
    }

    function getEvent(e) {
        var channel = e.channel || postal.configuration.DEFAULT_CHANNEL;
        var topic = e.topic;
        return (plugin.store[channel] || {})[topic];
    }

    var publish = postal.publish;
    postal.document = function (envelope) {
        saveEvent(envelope);
        return publish.apply(this, arguments);
    }

    var oldSubscribe = postal.subscribe;
    postal.subscribe = function (options) {
        var subscription = oldSubscribe.apply(this, arguments);
        invokeSubscriber();
        return subscription;

        function invokeSubscriber(){
            var env = getEvent(options);
            if (env) {
                subscription.invokeSubscriber(env.data, env);
            }
        }
    }

    postal.ChannelDefinition.prototype.document = function () {
        var envelope = {};
        var callback;
        if (typeof arguments[0] === "string") {
            envelope.topic = arguments[0];
            envelope.data = arguments[1];
            callback = arguments[2];
        } else {
            envelope = arguments[0];
            callback = arguments[1];
        }
        envelope.channel = this.channel;
        this.bus.document(envelope, callback);
    }

    return postal;
}));

