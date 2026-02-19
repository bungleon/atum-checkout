const healthCheck = (req, res) => {
  res.status(200).json({ status: "Application is running..." });
};

export default healthCheck;
