var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  req.db.all("SELECT * FROM todos WHERE user_id = " + req.session.user_id + " ORDER BY id", 
  function(err, todos) {
    res.render('todos-list',
    {todos: todos});
  })
  
});

router.get('/del/:id', function (req, res) {
  req.db.run("DELETE FROM todos WHERE id = " + req.params.id,
    () => res.redirect('/todos')
  );
});

router.post('/', function(req, res) {
  req.db.run("INSERT INTO todos (user_id, todo) VALUES (" + 
     req.session.user_id + ", '" + req.body.todo + "')", 
    () => res.redirect('')
  );
});

module.exports = router;
