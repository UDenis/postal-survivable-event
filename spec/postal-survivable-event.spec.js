describe("postal-survivable-event", function () {
    describe("when publish document", function () {
        it("shold fire callback", function () {
            var args = [];

            postal.subscribe({ topic:'my_event', callback: function(data){
                args.push(data)
            }});

            postal.document({topic:'my_event', data:{a:1}});

            postal.subscribe({ topic:'my_event', callback: function(data){
                args.push(data)
            }})

            args.length.should.be.exactly(2);

            console.log('======================')
            var channel = postal.channel(postal.configuration.DEFAULT_CHANNEL);
            channel.subscribe('my_event', function(data){
                args.push(data)
            })

            args.length.should.be.exactly(3);

            postal.document({topic:'my_event', data:{a:2}});

            args.length.should.be.exactly(6);

        })
    });
});
