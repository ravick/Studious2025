const fs = require('fs');

function getTopics(req, res)
{
  const data = fs.readFileSync('server/config/topics.json', 'utf8'); 
  const topics = JSON.parse(data); 
  res.json(topics);
};

module.exports = {
  getTopics
};