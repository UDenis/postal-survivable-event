describe('postal-survivable-event', function () {
    describe('when publish document', function () {
        it('shold fire callback', function () {
            var channel = postal.channel(postal.configuration.DEFAULT_CHANNEL);
            var args = [];

            postal.subscribe({
                topic: 'my_event', callback: function (data) {
                    args.push(data)
                }
            });

            postal.document({topic: 'my_event', data: {a: 1}});

            postal.subscribe({
                topic: 'my_event', callback: function (data) {
                    args.push(data)
                }
            })

            args.length.should.be.exactly(2);

            channel.subscribe('my_event', function (data) {
                args.push(data)
            })
            args.length.should.be.exactly(3);

            postal.document({topic: 'my_event', data: {a: 2}});
            args.length.should.be.exactly(6);
        });

        it('should clear internal storage', function () {
            var args = [];

            postal.document({channel: 'my_channel', topic: 'my_event', data: {a: 1}});
            postal.document({topic: 'my_event', data: {a: 1}});

            postal.subscribe({
                channel: 'my_channel', topic: 'my_event', callback: function (data) {
                    args.push(data);
                }
            });

            args.length.should.be.exactly(1);
            args = [];

            postal.document.clear({channel: 'my_channel', topic: 'my_event'});
            postal.subscribe({
                channel: 'my_channel', topic: 'my_event', callback: function (data) {
                    args.push(data);
                }
            });

            args.length.should.be.exactly(0);
            args = [];

            postal.subscribe({
                topic: 'my_event', callback: function (data) {
                    args.push(data);
                }
            });

            args.length.should.be.exactly(1);
            args = [];

            postal.document.clear({topic: 'my_event'});
            postal.subscribe({
                topic: 'my_event', callback: function (data) {
                    args.push(data);
                }
            });

            args.length.should.be.exactly(0);

            postal.document({topic: 'my_event2', data: {a: 1}});

            postal.document.clear();

            postal.subscribe({
                topic: 'my_event2', callback: function (data) {
                    args.push(data);
                }
            });

            args.length.should.be.exactly(0);
        });
    });
});
