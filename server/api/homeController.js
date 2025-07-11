exports.Home = async (req, res) => {
  res.json({ message: 'Welcome Studious ! Your user ID is ' + req.session.userId });
};
