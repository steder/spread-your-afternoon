
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Spread Your Afternoon',
                        topics: [[1, 2, 3],
                                 ['a', 'b', -2]
                                 ]
                                }
                      );
};
