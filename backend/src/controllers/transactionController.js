const axios = require('axios');
const Transaction = require('../models/Transaction');

const fetchAndStoreData = async () => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Transaction.deleteMany({});
    await Transaction.insertMany(response.data.map(item => ({
      ...item,
      dateOfSale: new Date(item.dateOfSale)
    })));
    console.log('Data fetched and stored successfully');
    return true;
  } catch (error) {
    console.error('Error fetching data:', error);
    return false;
  }
};

exports.getTransactions = async (req, res) => {
  try {
    let { month = 'March', search = '', page = 1, perPage = 10 } = req.query;
    page = parseInt(page);
    perPage = parseInt(perPage);

    const monthNumber = new Date(`${month} 1`).getMonth() + 1;
    let query = {
      $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] }
    };

    if (search.trim()) {
      const searchNumber = parseFloat(search);
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
      if (!isNaN(searchNumber)) {
        query.$or.push({ price: searchNumber });
      }
    }

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ dateOfSale: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.json({
      transactions,
      pagination: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const { month } = req.query;
    const count = await Transaction.countDocuments();
    if (count === 0) {
      await fetchAndStoreData();
    }

    const monthNumber = new Date(`${month} 1`).getMonth() + 1;

    const stats = await Transaction.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] }
        }
      },
      {
        $group: {
          _id: null,
          totalSaleAmount: { $sum: '$price' },
          soldItems: {
            $sum: { $cond: [{ $eq: ['$sold', true] }, 1, 0] }
          },
          notSoldItems: {
            $sum: { $cond: [{ $eq: ['$sold', false] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalSaleAmount: 0,
      soldItems: 0,
      notSoldItems: 0
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBarChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const count = await Transaction.countDocuments();
    if (count === 0) {
      await fetchAndStoreData();
    }

    const monthNumber = new Date(`${month} 1`).getMonth() + 1;

    const ranges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity }
    ];

    const result = await Promise.all(
      ranges.map(async ({ min, max }) => {
        const query = {
          $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] },
          price: { 
            $gte: min,
            ...(max !== Infinity ? { $lte: max } : {})
          }
        };

        const count = await Transaction.countDocuments(query);
        return {
          range: max === Infinity ? '901-above' : `${min}-${max}`,
          count
        };
      })
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPieChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const count = await Transaction.countDocuments();
    if (count === 0) {
      await fetchAndStoreData();
    }

    const monthNumber = new Date(`${month} 1`).getMonth() + 1;

    const result = await Transaction.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: { $ifNull: ['$_id', 'Uncategorized'] },
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCombinedData = async (req, res) => {
  try {
    const { month = 'March' } = req.query;
    const count = await Transaction.countDocuments();
    if (count === 0) {
      await fetchAndStoreData();
    }

    const monthNumber = new Date(`${month} 1`).getMonth() + 1;

    const [statistics, barChart, pieChart] = await Promise.all([
      Transaction.aggregate([
        {
          $match: {
            $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] }
          }
        },
        {
          $group: {
            _id: null,
            totalSaleAmount: { $sum: '$price' },
            soldItems: {
              $sum: { $cond: [{ $eq: ['$sold', true] }, 1, 0] }
            },
            notSoldItems: {
              $sum: { $cond: [{ $eq: ['$sold', false] }, 1, 0] }
            }
          }
        }
      ]),
      this.getBarChartData({ query: { month } }, { json: data => data }),
      this.getPieChartData({ query: { month } }, { json: data => data })
    ]);

    res.json({
      statistics: statistics[0] || {
        totalSaleAmount: 0,
        soldItems: 0,
        notSoldItems: 0
      },
      barChart,
      pieChart
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 