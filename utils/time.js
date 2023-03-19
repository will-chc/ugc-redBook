const getSevenDateArray = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      dates.push(d.toISOString().substring(0, 10));
    }
    return dates;
  }

  module.exports = {
    getSevenDateArray
  }