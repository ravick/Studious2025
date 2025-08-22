const simpleAiController = require('../api/simpleAiController');
const db = require('../config/db'); // Make sure this path is correct for your db instance

exports.getChatHistory = async (req, res) => {
  try { 
    const userEmail = req.session?.user?.email || req.session?.email  || req.query.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }
    db.all("SELECT * FROM chats WHERE userEmail like ?", [userEmail], (err, rows) => {
      if (err) {
        console.error('DB query error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(rows);
    });
  } catch (err) {
    console.error('Error in /chat/history:', err);
    res.status(500).json({ error: 'Internal server error' }); 
  }
};

exports.askAndSaveChat = async (req, res) => {
  try {
    const question = req.body.question;
    const userEmail = req.session?.user?.email || req.session?.email || req.body.email || 'guest@example.com';
    var topic = req.body.topic || req.body.selectedTopic;
    var subtopic = req.body.subtopic || req.body.selectedSubtopic;
    // Get the response from the AI
    const response = await simpleAiController.ask(req);
    const answer = response.answer || 'No answer provided';

    const  chatName = question.length > 50 ? question.substring(0, 50) + '...' : question;
    // Insert into database
    db.run(`
      INSERT INTO chats (chatName, userEmail, chatInputs, chatOutputs, topic, subtopic)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [chatName, userEmail, question, answer, topic, subtopic], function (err) {
      if (err) {
        console.error('DB insert error:', err);
        
      }

      // Send the response back to frontend with the new chat ID
      res.json({
        ...response,
        chatId: this.lastID
      });
    });
  } catch (err) {
    console.error('Error in /ask:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// api/chatController.js



