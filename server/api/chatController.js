const simpleAiController = require('../api/simpleAiController');
const db = require('../config/db'); // Make sure this path is correct for your db instance

exports.askAndSaveChat = async (req, res) => {
  try {
    const question = req.body.question;
    const userEmail = req.session?.user?.email || 'guest@example.com';

    // Get the response from the AI
    const response = await simpleAiController.ask(req);
    const answer = response.answer || 'No answer provided';

    // Insert into database
    db.run(`
      INSERT INTO chats (userEmail, chatInputs, chatOutputs)
      VALUES (?, ?, ?)
    `, [userEmail, question, answer], function (err) {
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
