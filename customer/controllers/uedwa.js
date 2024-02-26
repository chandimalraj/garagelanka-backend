exports.sendUrl = async (req, res) => {
  console.log("Send a demo Url");
  try {
    const URL = "https://www.firsttechfed.com/";

    res.status(200).json({ URL: URL });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
