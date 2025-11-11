const getHealth = (req, res) => {
  res.status(200).json({ status: 'ok' });
};

const getVersion = (req, res) => {
  res.status(200).json({
    version: process.env.npm_package_version,
    uptime: process.uptime(),
  });
};

export { getHealth, getVersion };
