module.exports = {
    asyncLoop: function (iterations, func, callback) {
        var index = 0;
        var done = false;
        var loop = {
            next: function () {
                if (done) {
                    return;
                }

                if (index < iterations) {
                    index++;
                    func(loop);

                } else {
                    done = true;
                    callback();
                }
            },

            iteration: function () {
                return index - 1;
            },
            
            setIteration: function(i) {
                index = i;  
            },

            break: function () {
                done = true;
                callback();
            }
        };
        loop.next();
        return loop;
    }
}