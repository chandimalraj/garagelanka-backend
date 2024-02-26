const { validationResult } = require("express-validator");

const District = require("../../models/District");
const expenseModel = require("../../models/Expense");

exports.addExpense = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { serviceCenterId, expenseDate } = req.body;

    //To-do - need to add role base permission
    if (serviceCenterId != req.user.serviceCenter._id) {
      console.log(
        " Cannot allow to add a billing due to this billing has not made by this service center : " +
          req.user.serviceCenterID
      );
      return res.status(400).json({
        msg: "Cannot confirm billing due to this billing has not made by this service center",
      });
    } else {
      const district = await District.findById(
        req.user.serviceCenter.district_id
      );
      const district_name = district.name_en;

      const model = `${district_name}_expense`;
      const modelLower = model.toLowerCase();

      const Expense = expenseModel(modelLower); //create collection
      const newExpense = new Expense(req.body);
      newExpense.expenseDate = new Date(expenseDate).toISOString();

      const expenseSaved = await newExpense.save();

      res.json({ expenseID: expenseSaved._id });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getAllExpenses = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = req.user;

    const district = await District.findById(user.serviceCenter.district_id);
    const district_name = district.name_en;

    const model = `${district_name}_expense`;
    const modelLower = model.toLowerCase();

    const Expense = expenseModel(modelLower);
    const expenses = await Expense.find({
      serviceCenterId: user.serviceCenter._id,
    });

    res.json(expenses);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getExpensesByDates = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = req.user;

    const district = await District.findById(user.serviceCenter.district_id);
    const district_name = district.name_en;

    const model = `${district_name}_expense`;
    const modelLower = model.toLowerCase();

    const Expense = expenseModel(modelLower);

    const from = new Date(req.params.from).toLocaleDateString();
    const to = new Date(req.params.to).toLocaleDateString();

    console.log("from", from);
    console.log("to", to);

    const expenses = await Expense.find({
      serviceCenterId: user.serviceCenter._id,
      expenseDate: { $gte: from, $lte: to },
    });

    res.status(200).json(expenses);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
